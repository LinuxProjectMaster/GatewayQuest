import { motion } from "framer-motion"
import { Col, Row, Container, Form, Button, ProgressBar, Tab, Tabs, Spinner, OverlayTrigger, Popover, Image } from "react-bootstrap"
import { useState } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


export default function HomepageSettings() {
	const [dataThing, setDataThing] = useState("Loading")	
	const [spinning, setSpinning] = useState(false)
	async function postRequest(e) {
		setSpinning(true)
	let response = await fetch('http://127.0.0.1:5000/post', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(settings)
	});
	setSpinning(false)
}

	const [step, setStep] = useState("1")
	const [progress, setProgress] = useState(1)
	const [timeRemaining, setTimeRemaining] = useState("3 hours")

	const [data, setData] = useState({
        labels: ["1:00", "2:00", "3:00"],
        datasets: [{
            label: "Flux",
            data: [5.38, 3.38, 2.38],
            fill: false,
            borderColor: "teal"
        }]
            })

	const color = {
		"electron": "outline-primary",
		"x-ray_electron": "outline-info",
		"radio_electron": "outline-success",
		"all": "outline-warning"
	}
	const [settings, setSettings] = useState({
		"input_chunk_length": 12,	
     "output_chunk_length": 6,
     "dimension_of_embedding_vectors": 32,
     "attention_heads": 4,
     "e_layers": 3,
     "d_layers": 3,
     "dropout": 0,
     "epochs": 100,
     "horizon": 3

	})
	const [enabledTabs, setEnabledTabs] = useState({
		"electron": "outline-info",
		"x-ray_electron": "outline-primary",
		"radio_electron": "outline-success",
		"all": "outline-warning"
	})

	const trainingColor = (id) => {
		setEnabledTabs(color)
		setEnabledTabs((prev) => ({
			...prev,
			[id]: String(color[id]).replace("outline-", "") 
		}))
		setSettings((prev) => ({
			...prev,
			training_data: id
		}))
		console.log(settings)

	}

	const next = () => {
		setStep((before) => String(parseInt(before) + 1))
	}

	const back = () => {
		setStep((before) => String(parseInt(before) - 1))
	}


	const handleSubmit = (e) => {
		e.preventDefault()
		console.log(settings)
	}

	const handleChange = (e) => {
		if (step != "1") {
		setSettings((prev) => ({
			...prev,
			[e.target.id]: e.target.value
		}))
		console.log(settings)
	}
		else if (step === "1") {
			trainingColor(e.target.id)
		}
	}

	return (
		<div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
			<Tabs
				activeKey={step}
				onSelect={(k) => setStep(k)}
				className="mb-3 tab-color"
				justify
			>
				<Tab eventKey="1" title="Step 1: Training Data">
					<div className="text-center px-4">
						<h3 className="display-6 pt-4">Training Data</h3>
						<Row className="py-2">
							<Col>
								<OverlayTrigger
									trigger={["hover", "focus"]}
									placement="right"
									overlay={
										<Popover id="popover-electron">
											<Popover.Body>
												This option uses only electron flux data for training. It's simpler and faster but may miss important features.
											</Popover.Body>
										</Popover>
									}
								>
									<Button type="button" className="mt-5" id="electron" onClick={handleChange} variant={enabledTabs["electron"]}>Electron Flux Only</Button>
								</OverlayTrigger>
							</Col>
						</Row>
						<Row className="py-2">
							<Col>
								<OverlayTrigger
									trigger={["hover", "focus"]}
									placement="right"
									overlay={
										<Popover>
											<Popover.Body>
												This model trains on both electron and X-ray flux data, providing richer context and <i>potentially</i> better predictions.
											</Popover.Body>
										</Popover>
									}
								>
									<Button disabled variant={enabledTabs["x-ray_electron"]} id="x-ray_electron" onClick={handleChange}>Electron and X-Ray Flux</Button>
								</OverlayTrigger>
							</Col>
						</Row>
						<Row className="py-2">
							<Col>
								<OverlayTrigger
									trigger={["hover", "focus"]}
									placement="right"
									overlay={
										<Popover>
											<Popover.Body>
												This model trains on type II/III radio wave fluctuations, X-ray flux, and electron flux. It's worth noting that in "A Machine Learning Approach to Predicting SEP Intensity" (Torres et Al, 2024), they found that x-ray flux had no effect on accuracy despite the correlation of SEP events with solar flares, which are measured by spikes in X-ray flux. Radio data is something that was not tried at all, suggesting that it will likely decrease the effectiveness of the model overall. Therefore, this third option is primarily experimental.
											</Popover.Body>
	 									</Popover>
									}
								>
									<Button disabled variant={enabledTabs["radio_electron"]} id="radio_electron" onClick={handleChange}>Radio, Electron, and X-Ray Flux</Button>
								</OverlayTrigger>
							</Col>
						</Row>
						<Row className="py-2">
							<Col>
								<OverlayTrigger
									trigger={["hover", "focus"]}
									placement="right"
									overlay={
										<Popover>
											<Popover.Body>
												This model trains on type II/III radio wave fluctuations and electron flux. This option is primarily experimental.
											</Popover.Body>
										</Popover>
									}
								>
									<Button disabled variant={enabledTabs["all"]} onClick={handleChange} id="all">Radio, Electron Flux</Button>
								</OverlayTrigger>
							</Col>
						</Row>
					</div>

					<div className="text-center mt-4 pt-4">
						<Button className="m-4" disabled>
							Back
						</Button>
						<Button onClick={next}>Next</Button>
					</div>
				</Tab>

				<Tab eventKey="2" title="Step 2: Configure Model">
					<Container className="flex-grow-1 overflow-auto">
						<Row>
							<Col className="text-center p-5">
								<h3 className="display-6">Configure Model</h3>
							</Col>
						</Row>

						<Form onSubmit={handleSubmit} className="p-4">
							<Form.Group className="mb-4">
								<Row className="mb-3">
									<Col>
										<Form.Label> Forecast Horizon </Form.Label>
										<Form.Select id="horizon" onChange={handleChange}>
											<option value="3">3 hours</option>
											<option value="6">6 hours</option>
											<option value="9">9 hours</option>
											<option value="12">12 hours</option>
										</Form.Select>
									</Col>
									<Col>
										<Form.Label> Dropout </Form.Label>
										<Form.Select id="dropout" onChange={handleChange}>
											<option value="0">0</option>
											<option value="0.05">0.05</option>
											<option value="0.1">0.1</option>
											<option value="0.15">0.15</option>
											<option value="0.2">0.2</option>
										</Form.Select>
									</Col>
								</Row>
								<Row>
									<Col>
										<Form.Label className="pt-3"> Number of Epochs </Form.Label>
										<Form.Control id="epochs" onChange={handleChange} type="number" placeholder="100" />
									</Col>
									<Col>
										<Form.Label className="pt-3"> Input Length (1h per data point)</Form.Label>
										<Form.Control id="input_chunk_length" onChange={handleChange} type="number" placeholder="12" />
									</Col>
									<Col>
										<Form.Label className="pt-3"> Output Length (1h per data point)</Form.Label>
										<Form.Control id="output_chunk_length" onChange={handleChange} type="number" placeholder="6" />
									</Col>
								</Row>
								<Row>
									<Col>
										<Form.Label className="pt-3"> Batch Size</Form.Label>
										<Form.Control id="dimension_of_embedding_vectors" onChange={handleChange} type="number" placeholder="32" />
									</Col>
								</Row>
							</Form.Group>
							<div className="text-center mt-4 pt-4">
								<Button className="m-4" onClick={back}>
									Back
								</Button>
								<Button type="submit" onClick={next}>
									Next
								</Button>
							</div>
						</Form>
					</Container>
				</Tab>

				<Tab eventKey="3" title="Step 3: Download Weights">
					<div className="text-center mt-4 pt-4">
						<Container className="text-center p-5">
							<h2 className="mb-4 pb-5 display-6">Model Loading...</h2>
							<>
							{spinning && (
							<Spinner animation="border" variant="primary" className="m-4" />
							)}
							</>
							<Row>
								<Col className="text-center">
									<Button onClick={postRequest} type="button" variant="success" className="m-3" style={{width:"20%"}}>Load Weights</Button>
								</Col>
							</Row>
						</Container>
						<Button className="mx-4 my-3" onClick={back}>
							Back
						</Button>
						<Button type="submit" onClick={next}>
							Next
						</Button>
					</div>
				</Tab>

				<Tab eventKey="4" title="Step 4: Try Out the Model!">
					<div className="mx-4 mb-5" style={{ height: "70vh", overflow: "visible"}}>
            			<h3 className="text-center display-6 my-4">Predicted Electron Flux</h3>
            				<div className="text-center" style={{height: "100%", overflow: "visible" }}>
            					<Image src='/image.png' className="my-3 py-2" />
            				</div>
            	</div>
				</Tab>
			</Tabs>
			{step !== "4" && (
			<div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", padding: "5px" }}>
				<ProgressBar animated now={parseInt(step) * 25} label={`${parseInt(step) * 25}%`} variant="success" />
			</div>
			)}
		</div>

	)
}
