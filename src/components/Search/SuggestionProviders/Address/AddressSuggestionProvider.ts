import { ISuggestionProvider, Suggestion } from '../../index';
import { getAddressSuggestions, getAddress } from '@/api/search';
import AddressSuggestionComponent from './AddressSuggestionComponent.vue';

export class AddressSuggestionProvider implements ISuggestionProvider {
    icon = 'map';
    renderComponent = AddressSuggestionComponent;

    isMatchByInput(input: string) {
        return input.length > 3;
    }

    async getSuggestions(input: string) {
        return (await getAddressSuggestions(input)).map(s => ({
            text: s.Full,
            obj: s, isMatch: true
        }));
    }

    async prepareResult(suggestion: Suggestion) {
        const address = await getAddress(suggestion.text);
        return address;
    }

}
