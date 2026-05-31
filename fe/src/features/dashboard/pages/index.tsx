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
    editor_rate?: number | null;
    editor_earning?: number | null;
    reporter_earning?: number | null;
    reporter_name?: string;
};

type CreateJobForm = {
    case_name: string;
    duration: string;
    location: string;
    city: string;
};

type AssignmentMode = 'reporter' | 'editor';

type UpdateJobPayload = Partial<{
    status: Jobs["status"];
    reporter_id: number;
    editor_id: number;
    reporter_earning: number;
    editor_earning: number;
}>;

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
    NEW: "Assign Reporter",
    ASSIGNED: "Transcribe",
    TRANSCRIBED: "Review",
    REVIEWED: "Complete",
    COMPLETED: "Completed",
};

const REPORTER_RATE_PER_MINUTE = 2000;

function formatRupiah(amount: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(amount);
}

function getJobStatus(job: Jobs) {
    return job.status.toUpperCase() as Jobs["status"];
}

function getJobActionLabel(job: Jobs) {
    const status = getJobStatus(job);

    if (status === 'TRANSCRIBED' && !job.editor_id) {
        return 'Assign Editor';
    }

    return BUTTON_LABELS[status];
}

function Dashboard() {

    const [reporters, setReporters] = React.useState<Reporter[]>([]);
    const [editors, setEditors] = React.useState<Editor[]>([]);
    const [jobs, setJobs] = React.useState<Jobs[]>([]);
    const [selectedJob, setSelectedJob] = React.useState<Jobs | null>(null);
    const [assignmentMode, setAssignmentMode] = React.useState<AssignmentMode>('reporter');
    const [statusUpdatingJobId, setStatusUpdatingJobId] = React.useState<number | null>(null);
    const [opened, { open, close }] = useDisclosure(false);

    function getEditorRate(job: Jobs) {
        return job.editor_rate ?? editors.find((editor) => editor.id === job.editor_id)?.rate ?? 0;
    }

    function calculateReporterEarning(job: Jobs) {
        return job.reporter_earning ?? (job.reporter_id ? job.duration * REPORTER_RATE_PER_MINUTE : 0);
    }

    function calculateEditorEarning(job: Jobs) {
        return job.editor_earning ?? (job.editor_id ? getEditorRate(job) : 0);
    }

    function calculateJobEarning(job: Jobs) {
        return calculateReporterEarning(job) + calculateEditorEarning(job);
    }

    function calculateTotalPayout() {
        return jobs.reduce((total, job) => total + calculateJobEarning(job), 0);
    }

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
        {
            accessor: 'duration', title: "Duration (menit)", render: (record) => {
                return <Text>{record.duration} menit</Text>;
            }
        },
        { accessor: 'location', title: "Location" },
        { accessor: 'city', title: "City" },
        {
            accessor: 'status', render: (record) => {
                const status = getJobStatus(record);
                return <Badge color={STATUS_COLORS[status]} size="xs">{STATUS_LABELS[status]}</Badge>;
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
            accessor: 'reporter_earning', title: "Reporter Earning", render: (record) => {
                return <Text>{formatRupiah(calculateReporterEarning(record))}</Text>;
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
            accessor: 'editor_earning', title: "Editor Earning", render: (record) => {
                return <Text>{formatRupiah(calculateEditorEarning(record))}</Text>;
            }
        },
        {
            accessor: 'total_earning', title: "Total Earning", render: (record) => {
                return <Text>{formatRupiah(calculateJobEarning(record))}</Text>;
            }
        },
        {
            accessor: 'actions',
            title: <Box mr={6}>Actions</Box>,
            width: "0%",
            textAlign: 'right',
            render: (record) => (
                <Button
                    onClick={() => handleJobAction(record)}
                    variant="light"
                    color={STATUS_COLORS[getJobStatus(record)]}
                    size="xs"
                    loading={statusUpdatingJobId === record.id}
                    disabled={getJobStatus(record) === 'COMPLETED'}
                >
                    {getJobActionLabel(record)}
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

    function openAssignModal(job: Jobs, mode: AssignmentMode) {
        setSelectedJob(job);
        setAssignmentMode(mode);
        open();
    }

    function closeAssignModal() {
        close();
        setSelectedJob(null);
    }

    async function updateJob(jobId: number, payload: UpdateJobPayload) {
        const response = await fetch(`http://localhost:3001/api/jobs/${jobId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await fetchJobs();
        setJobs(data.data);
    }

    async function assignJob({
        jobId,
        assigneeId,
        mode,
    }: {
        jobId: number;
        assigneeId: number;
        mode: AssignmentMode;
    }) {
        const job = jobs.find((jobItem) => jobItem.id === jobId);

        if (!job) {
            return;
        }

        const payload: UpdateJobPayload = mode === 'reporter'
            ? {
                reporter_id: assigneeId,
                reporter_earning: job.duration * REPORTER_RATE_PER_MINUTE,
                status: 'ASSIGNED',
            }
            : {
                editor_id: assigneeId,
                editor_earning: editors.find((editor) => editor.id === assigneeId)?.rate ?? 0,
            };

        await updateJob(jobId, payload);
    }

    async function handleJobAction(job: Jobs) {
        const status = getJobStatus(job);

        if (status === 'NEW') {
            openAssignModal(job, 'reporter');
            return;
        }

        if (status === 'TRANSCRIBED' && !job.editor_id) {
            openAssignModal(job, 'editor');
            return;
        }

        const nextStatus = status === 'ASSIGNED'
            ? 'TRANSCRIBED'
            : status === 'TRANSCRIBED'
                ? 'REVIEWED'
                : status === 'REVIEWED'
                    ? 'COMPLETED'
                    : null;

        if (!nextStatus) {
            return;
        }

        setStatusUpdatingJobId(job.id);

        try {
            await updateJob(job.id, { status: nextStatus });
        } catch (error) {
            console.error('Error updating job status:', error);
        } finally {
            setStatusUpdatingJobId(null);
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
                    <Text size="xs" fw="700">{formatRupiah(REPORTER_RATE_PER_MINUTE)}/menit</Text>

                </Box>

            </Flex>

            <Flex gap={"md"} mt={"md"} wrap={"wrap"}>
                <Card p="lg" radius="md" withBorder style={{ flex: "1 1 300px" }}>
                    <Text c="gray" fw="600" size="xs">Total Jobs</Text>
                    <Text size="xl" fw="700">{jobs.length}</Text>
                </Card>
                <Card p="lg" radius="md" withBorder style={{ flex: "1 1 300px" }}>
                    <Text c="gray" fw="600" size="xs">In Progress</Text>
                    <Text size="xl" fw="700">{jobs.filter((job) => getJobStatus(job) === 'ASSIGNED').length}</Text>
                </Card>
                <Card p="lg" radius="md" withBorder style={{ flex: "1 1 300px" }}>
                    <Text c="gray" fw="600" size="xs">Total Payout</Text>
                    <Text size="xl" fw="700">
                        {formatRupiah(calculateTotalPayout())}
                    </Text>
                </Card>
            </Flex>

            <Flex gap={"md"} mt={"md"} wrap={"wrap"}>
                <Card p="lg" radius="md" withBorder style={{ flex: "1 1 300px" }}>
                    <Text fw="700" size="xl">Create Job</Text>

                    <form onSubmit={form.onSubmit((values) => {
                        form.reset();
                        createJob(values).then(() => {
                            fetchJobs().then((data) => {
                                setJobs(data.data);
                            });
                        });
                    })}>
                        <TextInput
                            key={form.key('case_name')}
                            label="Case Name"
                            placeholder="Enter case name"
                            {...form.getInputProps('case_name')}
                        />
                        <TextInput
                            key={form.key('duration')}
                            label="Duration"
                            placeholder="Enter duration"
                            {...form.getInputProps('duration')}
                        />
                        <Select
                            key={form.key('location')}
                            label="Location"
                            placeholder="Enter location"
                            data={['On-site', 'Remote']}
                            {...form.getInputProps('location')}
                        />
                        <TextInput
                            key={form.key('city')}
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
                                    <Text>{editor.name} | {formatRupiah(editor.rate)}</Text>
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
            <ModalComp
                key={`${selectedJob?.id ?? 'assign-modal-empty'}-${assignmentMode}`}
                opened={opened}
                close={closeAssignModal}
                job={selectedJob}
                mode={assignmentMode}
                reporters={reporters}
                editors={editors}
                onAssign={assignJob}
            />
        </div>
    );
}

export default Dashboard;
