import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import { getSuggestions, getCoords } from '../../api';

@Component
export default class AddressSearchComponent extends Vue {
    addressList: string[] = [];
    selectedAddress: any = null;
    suggestions: any[] = [];

    async onTyping(val: string, upd: Function, abort: Function) {

        if (val == '' && this.selectedAddress) {
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
        const select = this.$refs.select as any;
        select.updateInputValue('', false);
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