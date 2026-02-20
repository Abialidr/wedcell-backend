const swaggerDocmantation = {
    openapi:"3.0.0",
    info:{
        title:"Demo",
        version:"0.0.1",
        description:"This is a demo projects api",
    },

    servers:[
        {
            url:"http://localhost:8080",
            description:"backend server"
        }
    ],

    tags:[{
        name:"User",
        description:"User routes",
    }],

    paths:{
           "/create/account":{
            post:{
                tags:["User"],
                description:"create the  users",
                responses:{
                    201:{
                        description:"Ok",
                        content:{
                            "application/json":{
                                schema:{
                                    type:"object",
                                    example:{
                                        count:0,
                                        user:[],
                                    }
                                }
                            }
                        },
                       
                    },
                    404:{
                        description:"User error"
                   },
                   500:{
                    description:"Server error"
               }
                }
            },
           },
    },
};




module.exports=swaggerDocmantation;