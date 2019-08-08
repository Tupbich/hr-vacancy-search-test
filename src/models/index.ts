export interface IGeoPoint {
    Lat: number,
    Lon: number;
}

export interface IHasGeo {
    GeoPoint: IGeoPoint;
}

export interface IShopVacancies extends IHasGeo {
    Address: string;
    Vacancies: IVacancy[];
}

export interface IVacancy {
    Profession: string;
}

export interface IAddressSuggestion {
    Full: string;
    Short: string;
}

export interface IAddress extends IHasGeo {
    Kind: "IAddress",
    Name: string;
    ShortName: string;
}

export interface IMetroLine {
    Kind: "IMetroLine",
    Name: string;
    HexColor: string;
    Stations: IMetroStation[];
}

export interface IMetroStation extends IHasGeo {
    Kind: "IMetroStation",
    Name: string;
    Line: IMetroLine
}