import sofaImg from '../components/floor_items/sofa.png';
import fridgeImg from '../components/floor_items/fridge.png';
import carImg from '../components/floor_items/car.png';
import treeImg from '../components/floor_items/tree.png';
import bikeImg from '../components/floor_items/bike.png';
import tvImg from '../components/floor_items/TV.png';
import cornerSofaImg from '../components/floor_items/corner_sofa.png';
import cabinetImg from '../components/floor_items/corner_kitchen_cabinet.png';

export const ASSET_URLS = {
  sofa: sofaImg,
  fridge: fridgeImg,
  car: carImg,
  tree: treeImg,
  bike: bikeImg,
  tv: tvImg,
  cornerSofa: cornerSofaImg,
  cabinet: cabinetImg,
};

// For React-Konva 2D View
const imageCache = {};

export function getFurnitureImage(type) {
  if (!ASSET_URLS[type]) return null;
  if (!imageCache[type]) {
    const img = new Image();
    img.src = ASSET_URLS[type];
    imageCache[type] = img;
  }
  return imageCache[type];
}
