import { motion } from "framer-motion"
import { Col, Row, Container, Image } from "react-bootstrap" 

export default function Aboutpage(){
	return (
		<div>
			<Container>
				<Row>
                <Col className="text-center py-5 display-4">
                    <motion.h1
                        initial={{ opacity: 0, y: -80 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.75 }}
                        className="display-4 mb-4"
                    >
                        About this project
                    </motion.h1>
                </Col>
            </Row>
            <Row className="py-5">
    			<Col className="text-center px-3">
        			<motion.p
            			initial={{ opacity: 0, y: -40 }}
			            animate={{ opacity: 1, y: 0 }}
			            transition={{ duration: 0.75, delay: 0.75 }}
			            style={{ fontSize: "1.1rem", lineHeight: "1.6" }}
			        >
            			This project was created for the <a href="https://stellar-gateway-quest.devpost.com/">Stellar Gateway Quest Hackathon</a> hosted by Devpost. It utilizes real-time NOAA GOES electron flux data at 1 AU to predict spikes in proton flux and the onset of Solar Energetic Protons (SEPs), which are instances where proton flux exceeds 10 pfu above 10 MeV. These events pose serious risks to onboard electronics and deep-space missions such as crewed journeys to Mars.
            			<br /><br />
            			The forecasting model is based on the Temporal Fusion Transformer model (TFT), a new architecture designed for long-term time series forecasting. Unlike traditional models like LSTMs, TFTs are capable of identifying long-range patterns critical for early space weather prediction. 
            			<br /><br />
            			The project uses a Flask backend powered by the Darts library for modeling, and a React-Bootstrap frontend for user interaction. You can view the code on <a href="https://github.com/LinuxProjectMaster/GatewayQuest">GitHub</a> and access the training dataset <a href="https://zenodo.org/records/12832882">here</a>.
            			<br /><br />
            			Overall, this project aims to advance the boundaries of Solar Energetic Particle (SEP) prediction, enhancing safety for future deep-space missions.
        			</motion.p>
    			</Col>
    			<Col md={4} className="text-center">
    				<motion.img
    					initial={{ opacity: 0, y: -40 }}
			            animate={{ opacity: 1, y: 0 }}
			            transition={{ duration: 0.75, delay: 0.75 }}
			            style={{ height: "350px", width: "auto" }}
			            src="https://raw.githubusercontent.com/LinuxProjectMaster/GatewayQuest/refs/heads/master/80c2be3e-3a07-4a85-a222-eec32947888e.png"
					
					/>
					<motion.p
            			initial={{ opacity: 0, y: -40 }}
			            animate={{ opacity: 1, y: 0 }}
			            transition={{ duration: 0.75, delay: 0.75 }}
			            className="py-3"
			        >
			        <p>Created by Ethan Schauder</p>
			        </motion.p>
			    </Col>
			</Row>

			</Container>
		 </div>
		)
}
