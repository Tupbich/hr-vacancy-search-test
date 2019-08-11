<template>
    <q-expansion-item expand-separator dense dense-toggle :disable="!vacanciesCount">

        <template v-slot:header>
            <q-item-section avatar :style="{'padding-left':6*level+'px'}">
                <q-badge dense :color="vacanciesCount>0?'primary':'grey'">
                    {{vacanciesCount}}
                </q-badge>
            </q-item-section>

            <q-item-section :class="{'text-accent': group.highlight}">
                <q-item-label>{{group.text}}</q-item-label>
                <q-item-label v-if="group.caption" caption>{{group.caption}}</q-item-label>
            </q-item-section>
        </template>

        <q-separator />

        <q-list separator>
            <VacancyComponent v-for="v in group.items" :key="v.Id" :vacancy="v"
                              @click.native="onShopClick(v)"
                              @mouseenter.native="onShopMouseEnter(v)"
                              @mouseleave.native="onShopMouseLeave(v)" />
        </q-list>

        <template v-if="group.childs">
            <VacancyGroup v-for="(g,i) in group.childs" :key="i" :group="g" :level="level+1"
                          @shop:click="onShopClick" @shop:mouseenter="onShopMouseEnter"
                          @shop:mouseleave="onShopMouseLeave" />
        </template>
    </q-expansion-item>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { VacancyGroup } from './VacancyList';
import VacancyComponent from './Vacancy.vue';
import { IShopVacancy } from '@/models';

@Component({ name: 'VacancyGroup', components: { VacancyComponent } })
export default class VacancyGroupComponent extends Vue {
    @Prop({ default: null })
    group!: VacancyGroup;

    @Prop({ default: 0 })
    level!: number;

    get vacanciesCount() {
        let cnt = this.group.items.length;
        if (!this.group.childs) return cnt;
        cnt += this.getChildsItemsCount(this.group.childs);
        return cnt;
    }

    getChildsItemsCount(childs: VacancyGroup[]): number {
        if (!childs) return 0;

        let cnt = 0;
        childs.forEach(c => {
            cnt += c.items.length;
            if (c.childs)
                cnt += this.getChildsItemsCount(c.childs);
        });
        return cnt;
    }

    @Emit('shop:mouseenter')
    onShopMouseEnter(s: IShopVacancy) {
        return s;
    }

    @Emit('shop:mouseleave')
    onShopMouseLeave(s: IShopVacancy) {
        return s;
    }

    @Emit('shop:click')
    onShopClick(s: IShopVacancy) {
        return s;
    }
}
</script>