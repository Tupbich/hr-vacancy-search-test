<template>
    <!-- hHh lpR fFf -->
    <q-layout view="lHh Lpr lFf">
        <q-header elevated>
            <q-toolbar>
                <AddressSearch style="width:100%;" @selected="onAddressSelect" />
            </q-toolbar>
        </q-header>

        <q-drawer :value="true" side="left" :width="350" bordered content-class="q-pa-xs">
            <div class="column" style="height: 100%">
                <div class="col-auto">
                    <q-select v-model="selectedProfessions" :options="professions" multiple filled use-chips dense
                              label="выберите профессию" />
                </div>
                <div class="col" style="overflow:auto">
                    <q-scroll-area style="height:100%">
                        <q-list separator>
                            <q-item clickable v-ripple v-for="s in shops" :key="s.Id" @click="onShopClick(s)"
                                    @mouseenter="focusedShop=s" @mouseleave="focusedShop=null" :active="focusedShop==s">
                                <q-item-section>
                                    <q-item-label>{{s.Address}}</q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                    <q-badge dense color="grey">{{s.vacancies.length}}</q-badge>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-scroll-area>
                </div>
            </div>

            <!-- <div class="col">
                <div class="col-xs-1">
                    <q-select v-model="selectedProfessions" :options="professions" multiple filled use-chips dense
                              label="выберите профессию"  />
                </div>

                <div class="col-xs-12" style="background-color:red">
                    Hi!
                     <q-list separator>
                    <q-item clickable v-ripple v-for="s in shops" :key="s.Id" @click="onShopClick(s)"
                            @mouseenter="focusedShop=s" @mouseleave="focusedShop=null" :active="focusedShop==s">
                        <q-item-section>
                            <q-item-label>{{s.Address}}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <q-badge dense color="grey">{{s.vacancies.length}}</q-badge>
                        </q-item-section>
                    </q-item>
                </q-list> 
                </div>

            </div> -->
        </q-drawer>

        <q-page-container>
            <q-page class="flex flex-center map-wrapper">
                <l-map class="map" :zoom="zoom" :center="center" ref="map" :min-zoom="6" @ready="onMapInit"
                       @update:bounds="boundsUpdated" @update:zoom="zoomUpdated" @update:center="centerUpdated">
                    <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />

                    <l-marker v-if="focusedShop" :lat-lng="[focusedShop.Lat, focusedShop.Lon]">
                        <l-tooltip :options="{permanent:true}">
                            <div>{{focusedShop.Address}}</div>
                            <div v-for="(v,i) in focusedShop.vacancies" :key="i">{{v.profession}}</div>
                        </l-tooltip>

                        <l-icon>
                            <q-icon class="shop-marker shop-marker--focused" name="place" size="24px" />
                        </l-icon>

                    </l-marker>

                    <l-marker-cluster :options="{maxClusterRadius:80}">
                        <template v-for="s in shops">
                            <l-marker v-if="s!=focusedShop" :key="s.Id" :lat-lng="[s.Lat, s.Lon]">
                                <l-tooltip>
                                    <div>{{s.Address}}</div>
                                    <div v-for="(v,i) in s.vacancies" :key="i">{{v.profession}}</div>
                                </l-tooltip>

                                <l-icon>
                                    <q-icon class="shop-marker" name="place" size="24px" />
                                </l-icon>
                            </l-marker>
                        </template>
                    </l-marker-cluster>

                    <template v-if="addressCircle">
                        <l-circle :lat-lng="addressCircle.latlng" color="" fill-color="#42A5F5"
                                  :radius="addressCircle.radius" />
                        <l-marker :lat-lng="addressCircle.latlng">
                            <l-icon>
                                <q-icon color="primary" size="12px" name="my_location" />
                            </l-icon>
                        </l-marker>
                    </template>

                    <template v-if="metroLines && zoom > 10">
                        <l-polyline v-for="m in metroLines" :key="m.id" :lat-lngs="m.points" :color="'#'+m.hex_color"
                                    :smooth-factor="0.5" :weight="6" :opacity="0.75">
                            <l-tooltip :options="{sticky:true}">
                                <div>линия: {{m.name}}</div>
                            </l-tooltip>
                        </l-polyline>

                        <template v-for="m in metroLines">
                            <l-marker v-for="s in m.stations" :key="s.id" :lat-lng="[s.lat, s.lng]">
                                <l-tooltip>
                                    <div>станция: {{s.name}}</div>
                                </l-tooltip>
                                <l-icon>
                                    <q-icon :style="{color:'#'+m.hex_color}" size="16px" name="directions_subway" />
                                </l-icon>
                            </l-marker>
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
