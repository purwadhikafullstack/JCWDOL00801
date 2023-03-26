import { Button, Image, Text } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import notFound from "../assets/notfound.png"

const NotFoundPage = ()=>{
    const navigate = useNavigate();
    return(
        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems:"center"}}>
            <Image src={notFound} h="40%" w="40%"></Image>
            <Text mt="-50px" fontSize="40px">404 PAGE NOT FOUND</Text>
            <Button variant={"solid"} colorScheme="green" mt={1} mb={"40px"} onClick={() => {navigate("/", {replace: true})
            navigate(0)
        }}>Go Home</Button>
        </div>
    )
}

export default NotFoundPage