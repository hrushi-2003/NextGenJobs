import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const PORT =3000;

app.get("/home",(req,res)=>{
  res.status(200).json({
    message:"Hi dude you are on perfect pace keep it up",
    success:true
  })
})

//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions={
  origin :"http//localhost:5173",
  credentials:true
};
app.use(cors(corsOptions));



app.listen(PORT,()=>{
  console.log(`server running in the port ${PORT}`);
})