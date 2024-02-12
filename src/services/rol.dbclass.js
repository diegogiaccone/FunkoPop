import rolModel from "../model/rol.model.js"

const createRol = async () => {
    try{
        const count = await rolModel.estimatedDocumentCount();
        if (count > 0) return;

        const values = await Promise.all([
            new rolModel({name : "Usuario"}).save(),
            new rolModel({name : "Premium"}).save(),
            new rolModel({name : "Admin"}).save()
        ]);
        console.log(values)
    }catch(err){
        console.log(err)
    }
}

export default createRol