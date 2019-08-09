<template>
    <!-- hHh lpR fFf -->
    <q-layout view="lHh Lpr lFf">
        <q-header elevated>
            <q-toolbar>
                <Search style="width:100%;" @selected="onSearchSelect" :point="center" />
            </q-toolbar>
        </q-header>

        <q-drawer :value="true" side="left" :width="350" bordered content-class="q-pa-xs">
            <div class="column" style="height: 100%">
                <div class="col-auto">
                    <q-select v-model="selectedProfessions" :options="professions" multiple filled
                              use-chips dense label="выберите профессию" />
                </div>
                <div class="col" style="overflow:auto">
                    <q-scroll-area style="height:100%">
                        <VacancyList :vacancies="shops" :location="searchLocation"
                                     :radius="searchRadius" @shop:click="onShopClick"
                                     @shop:mouseenter="focusedShop=$event"
                                     @shop:mouseleave="focusedShop=null" />
                    </q-scroll-area>
                </div>

                <div class="col-auto q-px-lg">
                    <q-badge color="primary">
                        радиус поиска {{ searchRadius }} метров
                    </q-badge>
                    <q-slider v-model="searchRadius" :min="500" :max="1500" :step="100" />
                </div>
            </div>

        </q-drawer>

        <q-page-container>
            <q-page class="flex flex-center map-wrapper">
                <l-map class="map" ref="map" :zoom="zoom" :center="center" :min-zoom="6"
                       @ready="onMapInit" @update:bounds="boundsUpdated" @update:zoom="zoomUpdated"
                       @update:center="centerUpdated" :options="{wheelPxPerZoomLevel:120}">
                    <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />

                    <l-marker v-if="focusedShop" :lat-lng="[focusedShop.Lat, focusedShop.Lon]">
                        <l-tooltip :options="{permanent:true}">
                            <div>{{focusedShop.Address}}</div>
                            <div v-for="(v,i) in focusedShop.vacancies" :key="i">{{v.profession}}
                            </div>
                        </l-tooltip>

                        <l-icon>
                            <q-icon class="shop-marker shop-marker--focused" name="place"
                                    size="24px" />
                        </l-icon>

                    </l-marker>

                    <l-marker-cluster :options="{maxClusterRadius:80}">
                        <l-marker v-for="s in shops" :key="s.Id" :lat-lng="[s.Lat, s.Lon]">
                            <l-tooltip>
                                <div>{{s.Address}}</div>
                                <div v-for="(v,i) in s.vacancies" :key="i">{{v.profession}}
                                </div>
                            </l-tooltip>

                            <l-icon>
                                <q-icon class="shop-marker" name="place" size="24px" />
                            </l-icon>
                        </l-marker>
                    </l-marker-cluster>

                    <template v-if="zoom>10">
                        <AddressMarker v-if="searchLocation && searchLocation.Kind=='IAddress'"
                                       :address="searchLocation" :radius="searchRadius" />

                        <template v-if="metroLines">
                            <MetroLineMarker v-for="m in metroLines" :key="m.Name" :metroLine="m"
                                             @click="onMetroClick" :opacity="isActiveMetro(m)?1:.5"
                                             :radius="searchRadius" :active="isActiveMetro(m)" />
                        </template>
                    </template>

                </l-map>
            </q-page>
        </q-page-container>

    </q-layout>
</template>

<script lang="ts" src="./Map.ts"/>

<style lang="scss" scoped>
.map-wrapper {
    position: relative;
}
.map {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    & /deep/ .leaflet-tile-pane {
        .leaflet-tile {
            filter: grayscale(40%);
        }
    }
}
.shop-marker {
    border: 3px solid transparent;
    color: #1976d2;
    width: auto;
    height: auto;
}
.shop-marker--focused {
    box-sizing: content-box;
    border: 3px solid #0d47a1;
    border-radius: 50%;
}

.leaflet-marker-icon .q-icon {
    transform: translate3d(-30%, -50%, 0);
}
</style>
