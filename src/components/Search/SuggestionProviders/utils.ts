export const icludesToken = (str: string, search: string) => {
    const tokens = search.toLocaleLowerCase().split(' ');
    return tokens.every(t => str.toLocaleLowerCase().includes(t));
}