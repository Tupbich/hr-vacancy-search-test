export const icludesToken = (str: string, search: string) => {
    const tokens = search.toLocaleLowerCase().split(/\s/);
    return tokens.some(t => str.toLocaleLowerCase().includes(t));
}