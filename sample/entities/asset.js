var Asset=new ef.EntitySchema('Asset',{
    id:Number,
    attributes:{
        overview_name:{type:String,required:true},
        overview_provider:{type:String,required:true},
        overview_version: {type:String,required:true},
        images_thumbnail:{type:String,required:true},
        images_banner:{type:String,required:true}
    },
    _documentation:{
        name:String
    }
},{
    parent:'Sample',
    inheritPlugins:false
});


Asset.plug()

