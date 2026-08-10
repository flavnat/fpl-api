import { fetch } from "undici";

const res = await fetch("https://fantasy.premierleague.com/api/bootstrap-static/");

console.log(await res.json());