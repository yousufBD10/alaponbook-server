const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");


require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERS}:${process.env.DB_PASSWORD}@cluster0.fvyg8ej.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run(){
    try{
        const userCollection = client.db("alaponbook").collection("users");
        const postCollection = client.db("alaponbook").collection("posts");
        const commentsCollection = client.db("alaponbook").collection("comments");

    
        app.post('/posts',async(req,res)=>{
            const posts = req.body;
            const result = await postCollection.insertOne(posts);
            res.send(result);
          })

          app.get("/allpost", async (req, res) => {
            const query = {};
            const result = await postCollection.find(query).sort({like: -1,post_date:-1}).toArray();
      
            res.send(result);
          });

          
        app.get('/mediadetails/:id', async (req,res)=>{
            const id = req.params.id
            const query = {_id:ObjectId(id)};
            const post = await postCollection.findOne(query);
           
            res.send(post);

         });

         app.post('/comments', async (req,res)=>{
            const comment = req.body;
            const result = await commentsCollection.insertOne(comment);
            res.send(result);
         });

         app.get('/comments/:id', async (req,res)=>{
            const id = req.params.id
            console.log(id);
            const query = {post_id:id};
            const result = await commentsCollection.find(query).sort({post_date:-1}).toArray();;
           
            res.send(result);

         });



    }
    catch{
        console.error(error);
    }
}

run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("alaponbook server is running");
});

app.listen(port, () => {
  console.log(`alaponbook server is running on ${port}`);
});