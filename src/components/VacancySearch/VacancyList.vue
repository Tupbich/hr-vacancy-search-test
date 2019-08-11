<template>
    <q-list separator>
        <template v-if="groups">
            <VacancyGroupComponent v-for="(g,i) in groups" :key="i" :group="g"
                                   @shop:click="onShopClick" @shop:mouseenter="onShopMouseEnter"
                                   @shop:mouseleave="onShopMouseLeave" />
        </template>

        <template v-if="!groups">
            <VacancyComponent v-for="v in vacancies" :key="v.Id" :vacancy="v"
                              @click.native="onShopClick(v)"
                              @mouseenter.native="onShopMouseEnter(v)"
                              @mouseleave.native="onShopMouseLeave(v)" />
        </template>
    </q-list>
</template>

<script lang="ts" src="./VacancyList.ts" />