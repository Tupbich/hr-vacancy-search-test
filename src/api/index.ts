import axios from "axios";
import allShops from './data_mock/shops';
import metro from './data_mock/metro_stations';
import { isPointWithinRadius } from 'geolib';

import { Bounds } from 'leaflet';

// tslint:disable-next-line: typedef
const dadata = axios.create({
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Token 4504fabf7a4b6d867ecf991331cd7d6758a8b910"
    }
});

export async function getSuggestions(address: string) {
    const body = { query: address, count: 10 };
    const res = await dadata.post("https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address", body);
    const data = res.data;
    let suggestions = [];
    if (data.suggestions) {
        suggestions = data.suggestions.map((x: any) => ({
            id: x.data.fias_id || x.data.kladr_id,
            shortAddress: x.value,
            fullAddress: x.unrestricted_value,
            coord: x.data.geo_lat ? { lat: x.data.geo_lat * 1, lon: x.data.geo_lon * 1 } : null
        }));
    }

    return suggestions;
}

export async function getCoords(address: string) {
    const body = { query: address, count: 1 };
    const res = await dadata.post("https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address", body);

    if (res.data.suggestions) {
        const details = res.data.suggestions[0];
        if (!details) return null;
        return {
            lat: details.data.geo_lat * 1,
            lon: details.data.geo_lon * 1,
        };
    }

    return null;
}

export async function getProfessions() {
    let allProfessions = allShops.reduce((professions, shop) => professions.concat((shop as any).vacancies.map((v: any) => v.profession)), [] as any[]);
    const professions = Array.from(new Set(allProfessions));
    return professions;
}

export async function getShopVacancies(search: { bounds: [[number, number], [number, number]], professions?: string[] }) {
    if (!search.bounds) return [];

    let shops = (allShops as any[]).filter(s => s.vacancies.length);
    const bounds = new Bounds(search.bounds);

    if (search.professions && search.professions.length) {
        shops = shops.filter(s => s.vacancies.some((v: any) => search.professions!.some(sp => sp == v.profession)));
    }

    shops = shops.filter(s => bounds.contains([s.Lat, s.Lon]));
    shops.forEach(s => {
        s.Vacancies = s.vacancies;
        s.GeoPoint = { Lat: s.Lat, Lon: s.Lon };
    })

    return shops;
}


const allLines = metro.reduce((lines, curr: any) => lines.concat(curr.lines), []);

export async function getMetroLines(search: { center: [number, number], radius: number, name?: string }) {

    let lines = allLines.filter((l: any) => l.stations.some((st: any) =>
        isPointWithinRadius([st.lat, st.lng], search.center, search.radius)));

    return lines;
}