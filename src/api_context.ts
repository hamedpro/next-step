import { createContext } from "react";
import axios from "axios";
var custom_axios = axios.create();
export var api_context = createContext({ custom_axios });
