require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 8000;
const app = express();




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9bbp7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

 app.use(cors());

app.use(express.json());


app.get('/',async(req,res)=>{
  res.send('the server is running....')
})

app.listen(port,()=>{console.log(`the server Runnign on PORT:${port}`);
})




async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    /*{Collection Name}*/ 
    await client.connect();

const MarathonAllData  = client.db('marathons').collection('AllMarathon')
const MarathonRegister = client.db('marathons').collection('Register') 
// Single Marathons api Route
app.post('/SingleMarathons',async(req,res)=>{
    const marathonData = req.body;
    // console.log('the data is',marathonData);
    
     const result = await MarathonAllData.insertOne(marathonData)
     res.send(result)
})  
// all marathonData get
app.get('/GetAllMarathon',async(req,res)=>{

    const result = await MarathonAllData.find().toArray();
  res.send(result)

})

// Single marathon DetailsData Get
app.get('/GetSingleDataDetails/:id',async(req,res)=>{
const id = req.params.id;
const query = {_id : new ObjectId(id)}
const result = await MarathonAllData.findOne(query);
// console.log('the result is ',result);

res.send(result)
})
// show Data in only 6
app.get('/marathonsLimit',async(req,res)=>{
  const limt = 6;
  const result = await MarathonAllData.find().limit(limt).toArray();
  // console.log('the limit Data is', result);
  res.send(result)
})
// my posted marathons list
app.get('/Mymarathons/:email',async(req,res)=>{
  const email = req.params.email;
  const query = {'email': email}
// console.log('the user email is', email);
const result = await MarathonAllData.find(query).toArray()
// console.log('the specific email data is', result);
res.send(result)

})
// single data delete api 
app.delete('/marathon/:id',async(req,res)=>{
  const id = req.params.id;
  // console.log('the deleted id is', id);
  const query = {_id : new ObjectId(id)}
  const result = await MarathonAllData.deleteOne(query);
  // console.log('the deleted item is ', result);
  
  res.send(result)
})
// single Data Update 
app.put('/marathonUpdate/:id',async(req,res)=>{
const id = req.params.id;
const query = {_id : new ObjectId(id)}
const oldData = req.body
const updateData = {
  $set : oldData
}
const option = {upsert : true}
const result = await MarathonAllData.updateOne(query,updateData,option)

res.send(result)

})

// marathon registration count
app.post('/MarathonReg',async(req,res)=>{
const RegData = req.body;
const result = await MarathonRegister.insertOne(RegData);
const filter = {_id : new ObjectId(RegData.marathonID)}  

const updateRegistration = {
  $inc : {Regmarathon : 1}
}

const UpdateCount = await MarathonAllData.updateOne(filter,updateRegistration)


res.json(result)

})

// marathon registration my apply list api 

app.get('/MyApplymarathon/:email',async(req,res)=>{
const email = req.params.email; 
const search  = req.query.search;
// console.log('the frontend data in backend', search);

const searchquery = {
'email' : email,
  title : { $regex :  search || '',   $options : 'i'}
}
const result = await MarathonRegister.find(searchquery).toArray();
res.send(result)
})





// my apply delete
app.delete('/MyApplyDelete/:id',async(req,res)=>{
  const id = req.params.id;
  const query = {_id : new ObjectId(id)}
  const result = await MarathonRegister.deleteOne(query); 
  res.send(result)
})


// my Apply Update api

app.patch('/MyApplyUpdate/:id',async(req,res)=>{
   const id = req.params.id;
  const query = {_id : new ObjectId(id)}
  const oldData = req.body;
const UpdateApplyData = {
  $set :{
    firstName : oldData.fname,
    LastName  : oldData.lname,
    contact   : oldData.phone
  }
}
const option = {upsert : true}

const result = await MarathonRegister.updateOne(query,UpdateApplyData,option)
// console.log('the Updated Data is here and log', updateMyApply);

// console.log('the old Data is', oldData , 'id is ', id);
res.send(result)

})



    // Send a ping to confirm a successful connection
     await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);





