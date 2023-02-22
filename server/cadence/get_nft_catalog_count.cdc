 import NFTCatalog from 0x49a7cda3a1eecc29

pub fun main(): Int {
    let catalog = NFTCatalog.getCatalog()
    let catalogIDs = catalog.keys
    return catalogIDs.length
}
