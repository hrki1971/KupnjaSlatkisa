
import {kategorije} from "./KategorijaPodaci";


async function get() {
    return {data:kategorije}
}
export default {
    get
}