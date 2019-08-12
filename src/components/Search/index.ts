import SearchComponent from './Search.vue';
import { SearchResult } from './Search'

export type SearchResult = SearchResult;
export default SearchComponent;

export type Suggestion = { text: string, obj: any, childs?: Suggestion[], isMatch: boolean };

export interface ISuggestionProvider {
    icon: string;
    description: string;
    isMatchByInput: (input: string) => boolean;
    getSuggestions: (input: string) => Promise<Suggestion[]>;
    prepareResult: (suggestion: Suggestion) => Promise<any>;
    renderComponent: any;
}

