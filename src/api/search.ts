import axios from "axios";
import metro from './data_mock/metro_stations';
import { isPointWithinRadius } from 'geolib';
import { IAddressSuggestion, IAddress, IGeoPoint, IMetroLine, IMetroStation } from '@/models';

const dadata = axios.create({
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Token 4504fabf7a4b6d867ecf991331cd7d6758a8b910"
    }
});

const allLines = metro.reduce((lines, curr: any) => lines.concat(curr.lines), [])
    .map((l: any) => {

        const line = <IMetroLine>{
            Name: l.name,
            HexColor: l.hex_color
        };

        const stations = l.stations.map((s: any) => (<IMetroStation>{
            Name: s.name,
            GeoPoint: { Lat: s.lat, Lon: s.lng },
            Line: line
        }))
        line.Stations = stations;

        return line;
    });

export async function getAddressSuggestions(address: string): Promise<IAddressSuggestion[]> {
    const body = { query: address, count: 10 };
    const res = await dadata.post("https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address", body);
    const data = res.data;

    let suggestions = [];
    if (data.suggestions) {
        suggestions = data.suggestions.map((x: any) => (<IAddressSuggestion>{
            Short: x.value, Full: x.unrestricted_value,
        }));
    }

    return suggestions;
}

export async function getAddress(address: string): Promise<IAddress> {
    const body = { query: address, count: 1 };
    const res = await dadata.post("https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address", body);
    const details = res.data.suggestions[0];

    return {
        Name: details.unrestricted_value,
        ShortName: details.value,
        GeoPoint: { Lat: details.data.geo_lat * 1, Lon: details.data.geo_lon * 1 }
    }
}

export async function getMetroLines(center: IGeoPoint, radius: number, name?: string): Promise<IMetroLine[]> {

    let lines = allLines.filter(l => l.Stations.some(st =>
        isPointWithinRadius([st.GeoPoint.Lat, st.GeoPoint.Lon], [center.Lat, center.Lon], radius)));

    if (name) {
        lines = lines.filter(l => l.Name.toLocaleLowerCase().includes(name) ||
            l.Stations.some(st => st.Name.toLocaleLowerCase().includes(name)));
    }

    return lines;
}
