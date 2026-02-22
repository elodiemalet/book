interface AiPromptMessage {
    role: string;
    content: string;
}


interface AiResponse {
    choices: AiResponseChoice[];
}

interface AiResponseChoice {
    message: AiResponseMessage;
}

interface AiResponseMessage {
    content: string;
}

class AiRequestBody {
    public model: string;
    public messages: AiPromptMessage[];

    constructor(model: string, messages: AiPromptMessage[]) {
        this.model = model;
        this.messages = messages;
    }
}

export class AiHttpClient {

    private readonly _url: string;
    private readonly _model: string;

    constructor() {

        this._url = process.env.AI_API_URL as string;
        this._model = process.env.AI_MODEL as string;
    }

    async post(body: AiRequestBody): Promise<AiResponse> {
        const response = await fetch(this._url + 'v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`AI API error ${response.status}: ${text}`);
        }

        return response.json();
    }

    generatePromptFromText(text: string): AiPromptMessage[] {
        return [
            {
                role: 'system',
                content: 'You are a helpful assistant who extracts structured data from raw text documents.',
            },
            {
                role: 'user',
                content: `Vous recevez en entrée un texte brut. Votre tâche est de :

                1. Extraire les informations suivantes :
                   - postTitle : le titre du document.
                   - author : le nom de l’auteur.
                   - content : Le corps du texte, restitué intégralement, sans aucune modifications ! Retirer le "postTitle" du "content". Conserver les sauts de paragraphe. 
                   - publishDate : la date de publication, au format ISO “YYYY-MM-DD”.
                
                2. Produire **uniquement** un **objet JSON** exactement dans ce format, sans commentaire, explication ou champ supplémentaire :
                
                {
                  "postTitle": "…",
                  "author": "…",
                  "content": "…",
                  "publishDate": "YYYY-MM-DD"
                }
                
                3. Ne rien retourner d’autre que cet objet JSON.
                
                Ne modifiez en rien le texte qui suit, ne rajoutez ni ponctuation, ni explications, ni formatage.
                Texte du document :
                ---
                ${text}
                ---`,
            },
        ];
    }

    public async getDocumentInformation(text: string): Promise<AiResponse> {
        const prompt = this.generatePromptFromText(text);

        const aiRequestBody = new AiRequestBody(this._model, prompt);
        return await this.post(aiRequestBody);
    }
}

