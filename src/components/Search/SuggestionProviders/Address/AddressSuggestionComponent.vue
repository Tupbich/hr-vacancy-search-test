<template>
    <q-item @click="emitSelect(suggestion)" clickable>
        <q-item-section>
            <q-item-label>{{ suggestion.text }}</q-item-label>
        </q-item-section>
    </q-item>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { AbstractSuggestionRenderComponent } from '../AbstractSuggestionRenderComponent';

@Component
export default class AddressSuggestionComponent extends AbstractSuggestionRenderComponent {

}
</script>