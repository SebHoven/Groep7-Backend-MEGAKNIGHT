interface Map {
  id?: number;
  createdAt?: Date;
  name: string;
  imageUrl: string;
  states?: MapState[];
}
interface MapState {
  id?: number;
  createdAt?: Date;
  zoom: number;
  positionX: number;
  positionY: number;
  mapId: number; // reference to Map
  map?: Map;
}

export {
  Map,
  MapState,
};
