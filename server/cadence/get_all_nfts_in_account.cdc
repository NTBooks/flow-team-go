import MetadataViews from 0x1d7e57aa55817448
import NFTCatalog from 0x49a7cda3a1eecc29
import NFTRetrieval from 0x49a7cda3a1eecc29

pub struct NFT {
    pub let id : UInt64
    pub let name : String
    pub let description : String
    pub let thumbnail : String
    pub let externalURL : String
    // pub let storagePath : StoragePath
    // pub let publicPath : PublicPath
    // pub let privatePath: PrivatePath
    // pub let publicLinkedType: Type
    // pub let privateLinkedType: Type
    pub let collectionName : String
    pub let collectionDescription: String
    pub let collectionSquareImage : String
    pub let collectionBannerImage : String
    pub let collectionExternalURL : String
    pub let royalties: [MetadataViews.Royalty]
 // storagePath : StoragePath,
            // publicPath : PublicPath,
            // privatePath : PrivatePath,
            // publicLinkedType : Type,
            // privateLinkedType : Type,
    init(
            id: UInt64,
            name : String,
            description : String,
            thumbnail : String,
            externalURL : String,
           
            collectionName : String,
            collectionDescription : String,
            collectionSquareImage : String,
            collectionBannerImage : String,
            collectionExternalURL : String,
            royalties : [MetadataViews.Royalty]
    ) {
        self.id = id
        self.name = name
        self.description = description
        self.thumbnail = thumbnail
        self.externalURL = externalURL
        // self.storagePath = storagePath
        // self.publicPath = publicPath
        // self.privatePath = privatePath
        // self.publicLinkedType = publicLinkedType
        // self.privateLinkedType = privateLinkedType
        self.collectionName = collectionName
        self.collectionDescription = collectionDescription
        self.collectionSquareImage = collectionSquareImage
        self.collectionBannerImage = collectionBannerImage
        self.collectionExternalURL = collectionExternalURL
        self.royalties = royalties
    }
}

pub fun main(ownerAddress: Address, pageSizeKeys: Int, page: Int) : { String : [NFT] } {
    let catalog = NFTCatalog.getCatalog()
    let account = getAuthAccount(ownerAddress)
    let items : [MetadataViews.NFTView] = []
    
    let data : {String : [NFT] } = {}
    var iter = 0;
    var currPage = 0;
   

   
    for key in catalog.keys {

        iter = iter + 1
        if (iter < (page)*pageSizeKeys){
            continue;
        }

        if (iter >= (page+1)*pageSizeKeys){
            continue;
        }

        let value = catalog[key]!
        let tempPathStr = "catalog".concat(key)
        let tempPublicPath = PublicPath(identifier: tempPathStr)!
        account.link<&{MetadataViews.ResolverCollection}>(
            tempPublicPath,
            target: value.collectionData.storagePath
        )
        let collectionCap = account.getCapability<&AnyResource{MetadataViews.ResolverCollection}>(tempPublicPath)
        if !collectionCap.check() {
            continue
        }
        let views = NFTRetrieval.getNFTViewsFromCap(collectionIdentifier : key, collectionCap : collectionCap)

        let items : [NFT] = []
        for view in views {
            let displayView = view.display
            let externalURLView = view.externalURL
            let collectionDataView = view.collectionData
            let collectionDisplayView = view.collectionDisplay
            let royaltyView = view.royalties
            if (displayView == nil || externalURLView == nil || collectionDataView == nil || collectionDisplayView == nil || royaltyView == nil) {
                // Bad NFT. Skipping....
                continue
            }

            items.append(
                NFT(
                    id: view.id,
                    name : displayView!.name,
                    description : displayView!.description,
                    thumbnail : displayView!.thumbnail.uri(),
                    externalURL : externalURLView!.url,
                    //storagePath : collectionDataView!.storagePath,
                    //publicPath : collectionDataView!.publicPath,
                   // privatePath : collectionDataView!.providerPath,
                    //publicLinkedType : collectionDataView!.publicLinkedType,
                    //privateLinkedType : collectionDataView!.providerLinkedType,
                    collectionName : collectionDisplayView!.name,
                    collectionDescription : collectionDisplayView!.description,
                    collectionSquareImage : collectionDisplayView!.squareImage.file.uri(),
                    collectionBannerImage : collectionDisplayView!.bannerImage.file.uri(),
                    collectionExternalURL : collectionDisplayView!.externalURL.url,
                    royalties : royaltyView!.getRoyalties()
                )
            )
        }
        data[key] = items
    }
    return data
}
 