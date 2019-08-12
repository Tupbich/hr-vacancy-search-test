import { IShopVacancy } from '@/models';
import { ISuggestionProvider, Suggestion } from '../../index';
import { icludesToken } from '../utils';
import VacancySuggestionComponent from './VacancySuggestionComponent.vue'

export class VacancySuggestionProvider implements ISuggestionProvider {
    icon = 'person_outline';
    description = "по вакансиям";
    vacanciesFunc: () => IShopVacancy[];
    renderComponent = VacancySuggestionComponent;

    constructor(vacanciesFunc: () => IShopVacancy[]) {
        this.vacanciesFunc = vacanciesFunc;
    }
    isMatchByInput(input: string) {
        return input.startsWith('в ');
    }

    async getSuggestions(input: string) {
        input = input.replace(/^в\s/, '');
        
        const suggestions = this.vacanciesFunc().map(v => ({
            text: v.Address,
            obj: v,
            isMatch:
                icludesToken(v.Region, input) ||
                icludesToken(v.Locality, input) ||
                icludesToken(v.Address, input),
            childs: v.Vacancies.map(vv => ({
                text: vv.Profession,
                obj: vv,
                isMatch: icludesToken(vv.Profession, input)
            }))
        }));


        return suggestions.filter(s => s.isMatch || s.childs.some(ss => ss.isMatch));
    }
    async prepareResult(suggestion: Suggestion) {
        return suggestion.obj;
    }
}
