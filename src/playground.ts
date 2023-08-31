import create_fake_roadmap_layers from "./create_fake_roadmap_layers.js";
import { roadmap_layers_to_dot } from "./roadmap_layers_to_dot.js";
var tmp = roadmap_layers_to_dot(create_fake_roadmap_layers());
console.log(tmp);
