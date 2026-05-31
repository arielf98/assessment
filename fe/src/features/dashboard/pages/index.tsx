import { Badge, Box, Button, Card, Divider, Flex, Select, SimpleGrid, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { DataTable, type DataTableColumn } from "mantine-datatable";
import React, { useEffect } from "react";
import ModalComp from "../../../components/ModalComp";
import { useDisclosure } from "@mantine/hooks";


type Reporter = {
    id: number;
    name: string;
    location_type: string;
    city: string;
    availability: string;
};

type Editor = {
    id: number;
    name: string;
    location_type: string;
    city: string;
    availability: string;
    rate: number;
};

export type Jobs = {
    id: number;
    case_name: string;
    duration: number;
    location: string;
    status: "NEW" | "ASSIGNED" | "TRANSCRIBED" | "REVIEWED" | "COMPLETED";
    city: string;
    reporter_id: number | null;
    editor_id: number | null;
    created_at: string;
    payout: number | null;
    editor_name?: string;
    reporter_name?: string;
};

type CreateJobForm = {
    case_name: string;
    duration: string;
    location: string;
    city: string;
};

const STATUS_COLORS: Record<Jobs["status"], string> = {
    NEW: "gray",
    ASSIGNED: "yellow",
    TRANSCRIBED: "orange",
    REVIEWED: "cyan",
    COMPLETED: "green",
};

const STATUS_LABELS: Record<Jobs["status"], string> = {
    NEW: "New",
    ASSIGNED: "Assigned",
    TRANSCRIBED: "Transcribed",
    REVIEWED: "Reviewed",
    COMPLETED: "Completed",
};

const BUTTON_LABELS: Record<Jobs["status"], string> = {
    NEW: "Assign",
    ASSIGNED: "Transcribe",
    TRANSCRIBED: "Review",
    REVIEWED: "Complete",
    COMPLETED: "Completed",
};

function Dashboard() {

    const [reporters, setReporters] = React.useState<Reporter[]>([]);
    const [editors, setEditors] = React.useState<Editor[]>([]);
    const [jobs, setJobs] = React.useState<Jobs[]>([]);
    const [opened, { open, close }] = useDisclosure(false);

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            case_name: '',
            duration: '',
            location: '',
            city: '',
        },
        validate: {
            case_name: (value) => value.length < 2 ? 'Case name must be at least 2 characters' : null,
            duration: (value) => isNaN(Number(value)) || Number(value) <= 0 ? 'Duration must be a positive number' : null,
            location: (value) => value.length === 0 ? 'At least one location must be selected' : null,
            city: (value) => value.length < 2 ? 'City must be at least 2 characters' : null,
        }
    });

    const columns: DataTableColumn<Jobs>[] = [
        { accessor: 'id', title: "Job ID" },
        { accessor: 'case_name', title: "Case" },
        { accessor: 'duration', title: "Duration" },
        { accessor: 'location', title: "Location" },
        { accessor: 'city', title: "City" },
        {
            accessor: 'status', render: (record) => {
                return <Badge color={STATUS_COLORS[record.status.toUpperCase() as keyof typeof STATUS_COLORS]} size="xs">{STATUS_LABELS[record.status.toUpperCase() as keyof typeof STATUS_LABELS]}</Badge>;
            }
        },
        {
            accessor: 'reporter', title: "Reporter", render: (record) => {
                return record.reporter_id ? (<Text size="sm">{record.reporter_name}</Text>) : (
                    <Badge color="red" size="xs">Unassigned</Badge>
                );

            }
        },
        {
            accessor: 'editor', title: "Editor", render: (record) => {
                return record.editor_id ? (<Text size="sm">{record.editor_name}</Text>) : (
                    <Badge color="red" size="xs">Unassigned</Badge>
                );
            }
        },
        {
            accessor: 'payout', title: "Payout", render: (record) => {
                return <Text>${record.payout ? record.payout.toFixed(2) : 'N/A'}</Text>;
            }
        },
        {
            accessor: 'actions',
            title: <Box mr={6}>Actions</Box>,
            width: "0%",
            textAlign: 'right',
            render: (record) => (
                <Button onClick={open} variant="light" color={STATUS_COLORS[record.status.toUpperCase() as keyof typeof STATUS_COLORS]} size="xs">
                    {BUTTON_LABELS[record.status.toUpperCase() as keyof typeof BUTTON_LABELS]}
                </Button>
            ),
        },
    ]


    async function fetchJobs() {
        try {
            const response = await fetch('http://localhost:3001/api/jobs');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching jobs:", error);
        }
    }

    async function fetchReporters() {
        try {
            const response = await fetch('http://localhost:3001/api/reporters');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching reporters:", error);
        }
    }


    async function fetchEditors() {
        try {
            const response = await fetch('http://localhost:3001/api/editors');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching editors:", error);
        }
    }

    async function createJob(jobs: CreateJobForm) {
        try {
            const response = await fetch('http://localhost:3001/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jobs),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error creating job:", error);
        }
    }

    useEffect(() => {
        fetchJobs().then((data) => {
            setJobs(data.data);
        });
        fetchReporters().then((data) => {
            setReporters(data);
        });
        fetchEditors().then((data) => {
            setEditors(data.data);
        });
    }, []);

    return (
        <div>
            <Flex>
                <Box>
                    <Text size="xs" fw="600">
                        Court Reporting
                    </Text>
                    <Text size="xl" fw="700">
                        Workflow Manager
                    </Text>
                </Box>
                <Box ml="auto" mt="md">
                    <Text size="xs">Reporter Rate</Text>
                    <Text size="xs" fw="700">$25.00/minute</Text>

                </Box>

            </Flex>

            <Flex gap={"md"} mt={"md"} wrap={"wrap"}>
                <Card p="lg" radius="md" withBorder style={{ flex: "1 1 300px" }}>
                    <Text c="gray" fw="600" size="xs">Total Jobs</Text>
                    <Text size="xl" fw="700">{jobs.length}</Text>
                </Card>
                <Card p="lg" radius="md" withBorder style={{ flex: "1 1 300px" }}>
                    <Text c="gray" fw="600" size="xs">In Progress</Text>
                    <Text size="xl" fw="700">{jobs.filter((job) => job.status === 'ASSIGNED').length}</Text>
                </Card>
                <Card p="lg" radius="md" withBorder style={{ flex: "1 1 300px" }}>
                    <Text c="gray" fw="600" size="xs">Total Payout</Text>
                    <Text size="xl" fw="700">
                        ${jobs.reduce((total, job) => total + (job.payout || 0), 0).toFixed(2)}
                    </Text>
                </Card>
            </Flex>

            <Flex gap={"md"} mt={"md"} wrap={"wrap"}>
                <Card p="lg" radius="md" withBorder style={{ flex: "1 1 300px" }}>
                    <Text fw="700" size="xl">Create Job</Text>

                    <form onSubmit={form.onSubmit((values) => {
                        createJob(values).then(() => {
                            form.reset();
                            fetchJobs().then((data) => {
                                setJobs(data.data);
                            });
                        });
                    })}>
                        <TextInput
                            label="Case Name"
                            placeholder="Enter case name"
                            {...form.getInputProps('case_name')}
                        />
                        <TextInput
                            label="Duration"
                            placeholder="Enter duration"
                            {...form.getInputProps('duration')}
                        />
                        <Select
                            label="Location"
                            placeholder="Enter location"
                            data={['On-site', 'Remote']}
                            {...form.getInputProps('location')}
                        />
                        <TextInput
                            label="City"
                            placeholder="Enter city"
                            {...form.getInputProps('city')}
                        />
                        <Button mt="md" type="submit">
                            Submit
                        </Button>
                    </form>

                </Card>
                <Card p="lg" radius="md" withBorder style={{ flex: "1 1 600px" }}>
                    <Text size="md" fw="700">Team</Text>

                    <SimpleGrid cols={2} mt="md">
                        <Box>
                            <Text fw="600">Reporters</Text>

                            {reporters?.map((reporter) => (
                                <Card key={reporter.id} mt="sm" withBorder p="sm">
                                    <Text>{reporter.name}</Text>
                                    <Flex gap="xs" mt="xs">
                                        <Text size="xs" c="gray">{reporter.location_type} </Text>
                                        <Divider orientation="vertical" />
                                        <Text size="xs" c="gray">{reporter.city} </Text>
                                        <Divider orientation="vertical" />
                                        <Badge color={reporter.availability === "Available" ? "green" : "red"} size="xs">
                                            {reporter.availability}
                                        </Badge>
                                    </Flex>
                                </Card>
                            ))}

                        </Box>
                        <Box>
                            <Text fw="600">Editors</Text>

                            {editors?.map((editor) => (
                                <Card key={editor.id} mt="sm" withBorder p="sm">
                                    <Text>{editor.name} | ${editor.rate.toFixed(2)}</Text>
                                    <Flex gap="xs" mt="xs">
                                        <Text size="xs" c="gray">{editor.location_type} </Text>
                                        <Divider orientation="vertical" />
                                        <Text size="xs" c="gray">{editor.city} </Text>
                                        <Divider orientation="vertical" />
                                        <Badge color={editor.availability === "Available" ? "green" : "red"} size="xs">
                                            {editor.availability}
                                        </Badge>
                                    </Flex>
                                </Card>
                            ))}
                        </Box>
                    </SimpleGrid>

                </Card>
            </Flex>

            <Flex gap={"md"} mt={"md"} wrap={"wrap"}>
                <Card p="lg" radius="md" withBorder style={{ flex: "1 1 300px" }} mb="lg">
                    <Text fw="700" size="xl">
                        Jobs
                    </Text>

                    <DataTable
                        columns={columns}
                        emptyState="No jobs found"
                        records={jobs} />
                </Card>
            </Flex>
            <ModalComp opened={opened} close={close} />
        </div>
    );
}

export default Dashboard;