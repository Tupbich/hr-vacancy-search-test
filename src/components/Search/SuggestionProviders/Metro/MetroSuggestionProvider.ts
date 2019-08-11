import { IMetroLine } from '@/models';
import { ISuggestionProvider, Suggestion } from '../../index';
import { icludesToken } from '../utils';
import MetroSuggestionComponent from './MetroSuggestionComponent.vue';

export class MetroSuggestionProvider implements ISuggestionProvider {
    icon = 'subway';
    renderComponent = MetroSuggestionComponent;
    metroLinesFunc: () => IMetroLine[];

    constructor(dataFunc: () => IMetroLine[]) {
        this.metroLinesFunc = dataFunc;
    }

    isMatchByInput(input: string) {
        return input.startsWith('м ');
    }

    async getSuggestions(input: string) {
        input = input.replace(/^м\s/, '');

        const suggestions = this.metroLinesFunc().map(l => ({
            text: l.Name,
            obj: l,
            isMatch: icludesToken(l.Name, input),
            childs: l.Stations.map(st => ({
                text: st.Name,
                obj: st,
                isMatch: icludesToken(st.Name, input),
            }))
        }));

        return suggestions.filter(s => s.isMatch || s.childs.some(ss => ss.isMatch));
    }

    async prepareResult(suggestion: Suggestion) {
        return suggestion.obj;
    }
}
