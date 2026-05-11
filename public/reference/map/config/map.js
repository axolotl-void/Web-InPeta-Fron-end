/*
 * map.js
 * Author: Alker
*/

const credit_by = "&copy; 2023 Dinas Peternakan Aceh. Map "
const dev_by = " - Alker&#8480;."

// Map Initialization
const map = L.map('alker-map').setView([4.1247256,97.2741216], 8);

// Google Map Initialization
const googleSat = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3'],
        attribution: credit_by + "Google Satelite" + dev_by
        });

const googleStreets = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3'],
        attribution: credit_by + "Google Streets" + dev_by
        });

const googleHybrid = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3'],
        attribution: credit_by + "Google Hybrid" + dev_by
        });

const googleTerrain = L.tileLayer('https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3'],
        attribution: credit_by + "Google Terrain" + dev_by
        });

googleStreets.addTo(map);
// googleHybrid.addTo(map);
