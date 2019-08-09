<template>
    <div>
        <q-list separator>
            <template v-if="groups">
                <q-expansion-item v-for="(g,i) in groups" :key="i" expand-separator :label="g.text"
                                  :caption="g.caption" dense dense-toggle
                                  :header-class="{'text-accent':highlightGroupText==g.text}"
                                  :disable="!g.items.length">

                    <template v-slot:header>

                        <q-item-section avatar>
                            <q-badge dense :color="g.items.length>0?'primary':'grey'">
                                {{g.items.length}}
                            </q-badge>
                        </q-item-section>

                        <q-item-section>
                            <q-item-label>{{g.text}}</q-item-label>
                            <q-item-label v-if="g.caption" caption>{{g.caption}}</q-item-label>
                        </q-item-section>

                    </template>

                    <q-separator />
                    <q-list separator>
                        <q-item v-for="v in g.items" :key="v.Id" clickable v-ripple
                                @click="onShopClick(v)" @mouseenter="onShopMouseEnter(v)"
                                @mouseleave="onShopMouseLeave(v)">
                            <q-item-section>
                                <q-item-label>{{v.Address}}</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-badge dense color="grey">{{v.Vacancies.length}}</q-badge>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-expansion-item>
            </template>

            <template v-if="!groups">
                <q-item v-for="v in vacancies" :key="v.Id" clickable v-ripple
                        @click="onShopClick(v)" @mouseenter="onShopMouseEnter(v)"
                        @mouseleave="onShopMouseLeave(v)">
                    <q-item-section>
                        <q-item-label>{{v.Address}}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <q-badge dense color="grey">{{v.Vacancies.length}}</q-badge>
                    </q-item-section>
                </q-item>
            </template>
        </q-list>
    </div>
</template>

<script lang="ts" src="./VacancyList.ts" />