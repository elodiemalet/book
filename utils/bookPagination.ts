import PostEntity from "../entities/PostEntity";

// Count how many visual lines a text line takes (accounting for wrapping)
export function visualLineCount(line: string, maxCharsPerLine: number): number {
    if (line.length <= maxCharsPerLine) return 1;
    return Math.ceil(line.length / maxCharsPerLine);
}

// Collect lines from array until visual line budget is spent
// Returns the number of source lines consumed
export function fillPage(lines: string[], maxVisualLines: number, maxCharsPerLine: number): number {
    let visualCount = 0;
    let consumed = 0;
    for (let i = 0; i < lines.length; i++) {
        const cost = visualLineCount(lines[i], maxCharsPerLine);
        if (visualCount + cost > maxVisualLines && consumed > 0) break;
        visualCount += cost;
        consumed++;
    }
    return consumed;
}

export interface BookPaginationLimits {
    maxLines: number;
    maxLinesFirstPage: number;
    maxCharsPerLine: number;
}

export function paginatePosts(posts: PostEntity[], limits: BookPaginationLimits): PostEntity[] {
    const pages: PostEntity[] = [];
    // Visual lines reserved for author/date footer on the last page
    const footerLines = 4;
    const {maxLines, maxLinesFirstPage, maxCharsPerLine} = limits;

    for (const post of posts) {
        const lines = post.content.split('\n');

        // Single-page poem: title + content + author/date footer must fit
        const singlePageCount = fillPage(lines, maxLinesFirstPage - footerLines, maxCharsPerLine);
        if (singlePageCount >= lines.length) {
            pages.push(post);
            continue;
        }

        // Multi-page poem
        // First page (title takes space, no footer)
        let offset = 0;
        const firstCount = fillPage(lines, maxLinesFirstPage, maxCharsPerLine);
        const firstChunk = lines.slice(0, firstCount).join('\n');
        pages.push(new PostEntity(
            post.id, post.postTitle, post.author,
            firstChunk, post.timestamp, post.publishDate
        ));
        offset = firstCount;

        // Continuation pages
        while (offset < lines.length) {
            const remaining = lines.slice(offset);
            // Check if remaining fits on last page (with footer)
            const lastPageCount = fillPage(remaining, maxLines - footerLines, maxCharsPerLine);
            const isLastChunk = lastPageCount >= remaining.length;
            const count = isLastChunk
                ? remaining.length
                : fillPage(remaining, maxLines, maxCharsPerLine);
            const chunk = remaining.slice(0, count).join('\n');
            pages.push(new PostEntity(
                post.id, post.postTitle, post.author,
                chunk, post.timestamp, post.publishDate
            ));
            offset += count;
        }
    }

    return pages;
}
