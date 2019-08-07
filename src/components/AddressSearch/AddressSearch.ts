import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import { getSuggestions, getCoords } from '../../api';
import geo, { Address, MetroLine, MetroStation } from '@/services/GeoService';

@Component
export default class AddressSearchComponent extends Vue {
    location: [number, number] | null = null;
    addressList: string[] = [];
    selectedAddress: any = null;
    suggestions: any[] = [];

    get select() {
        return this.$refs.select as any;
    }

    async onTyping(val: string, upd: Function, abort: Function) {
        const selectInputValue = this.select.inputValue;

        if (selectInputValue == '' && this.selectedAddress) {
            this.clear();
        };

        if (val.length < 3) {
            abort();
            return;
        }

        const suggestions = await getSuggestions(val);
        this.suggestions = suggestions;
        this.addressList = suggestions.map((s: any) => s.fullAddress);
        upd();
    }

    clear() {
        this.selectedAddress = null;
        this.select.updateInputValue('', false);
    }

    @Watch('selectedAddress')
    async emitSelected() {
        let address = this.selectedAddress;

        if (!address) {
            this.$emit('selected', address);
            return;
        }

        if (!address.coord || !address.coord.lat) {
            address.coord = await getCoords(address.fullAddress);
        }

        this.$emit('selected', address);
    }
}