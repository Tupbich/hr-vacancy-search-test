<template>
    <q-item clickable v-ripple>
        <q-item-section>
            <q-item-label>{{vacancy.Address}}</q-item-label>
            <q-item-label caption>
                {{vacancy.Region}} {{vacancy.Region!=vacancy.Locality?vacancy.Locality:''}}
            </q-item-label>
        </q-item-section>

        <q-item-section side>
            <q-badge dense color="grey">{{vacancy.Vacancies.length}}</q-badge>
        </q-item-section>
    </q-item>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { IShopVacancy } from '@/models';

@Component
export default class VacancyComponent extends Vue {
    @Prop()
    vacancy!: IShopVacancy;
}
</script>