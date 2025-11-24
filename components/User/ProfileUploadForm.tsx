'use client';

import React, {FormEvent, useCallback, useRef, useState} from 'react';
import Image from 'next/image';
import {
    Alert,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Link,
    Stack,
    TableCell,
    TableRow,
    Typography,
} from '@mui/material';

import {TextField, useFormHook} from '@components/FormFields';
import type {AlertColor} from '@mui/material/Alert';
import {IProfileStatus} from '@util/profile';
import {UserFileUploadModel} from '@util/models';
import {InferAttributes} from 'sequelize';
import {useRouter} from 'next/navigation';

type UploadModelClient = InferAttributes<UserFileUploadModel>;

interface ProfileUploadFormProps {
    fileUpload: UploadModelClient

    // uploadHooks: { [fileID: number]: FormHookObject<UserFileUploadModel> },

    updateFile(updatedFile: UploadModelClient): Promise<{ result: IProfileStatus, message: string }>,

    // onFileDeleted(): void,

    deleteFile(fileID: number): Promise<{ result: IProfileStatus, message: string }>,

    // onUpdate(newStatus: IProfileStatus): void,

    // status: 'ready' | 'unsaved' | 'updating' | 'error'
    adminMode?: boolean,
}

export function ProfileUploadForm({
                                      fileUpload: fileUploadServer,
                                      // uploadHooks,
                                      updateFile,
                                      // onFileDeleted,
                                      deleteFile,
                                      // onUpdate,
                                      // status
                                      adminMode = false,
                                  }: ProfileUploadFormProps) {
    // eslint-disable-next-line no-param-reassign
    // uploadHooks[fileUpload.id] = formUpload;
    const [status, setStatus] = useState<'ready' | 'unsaved' | 'updating' | 'error'>('ready');
    const [message, setMessage] = useState<[AlertColor, string]>(['info', '']);
    const [fileUploadClient, setFileUploadClient] = useState<UploadModelClient>(fileUploadServer);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const router = useRouter();

    const formUpload = useFormHook({
        formData: fileUploadClient,
        defaultFormData: fileUploadServer,
        setFieldValue(fieldName, value) {
            setFileUploadClient((prev) => ({
                ...prev,
                [fieldName]: value
            }));
        },
        showError: status === 'error'
    });

    const handleDelete = useCallback(async () => {
        setShowDeleteConfirm(false);
        // Submit to server
        setStatus('updating');
        setMessage(['info', 'Deleting image...']);
        try {
            const {message: deleteMessage} = await deleteFile(fileUploadServer.id);
            setStatus('ready');
            setMessage(['success', deleteMessage]);
            router.refresh();
        } catch (e: unknown) {
            setStatus('ready');
            setMessage(['error', (e as Error).message]);
        }
    }, [deleteFile, fileUploadServer.id, router]);

    const handleUpdate = useCallback(async () => {
        // Validation
        const {firstError} = formUpload;
        if (firstError) {
            const {message: firstErrorMessage, scrollToField} = firstError;
            setStatus('error');
            setMessage(['error', firstErrorMessage]);
            scrollToField();
            return;
        }

        // Submit to server
        setStatus('updating');
        setMessage(['info', 'Submitting form...']);
        try {
            // userProfileClient.uploads = profileUploads;
            const {message: updateMessage} = await updateFile(fileUploadClient);
            // onUpdate(updatedStatus);
            setStatus('ready');
            setMessage(['success', updateMessage]);
        } catch (e: unknown) {
            setStatus('ready');
            setMessage(['error', (e as Error).message]);
        }
        formRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
        });
    }, [fileUploadClient, formUpload, updateFile]);

    const formRef = useRef<HTMLFormElement>(null);
    return (
        <TableRow
            key={fileUploadServer.id}
        >
            <TableCell component="th" scope="row" sx={{verticalAlign: 'top'}}>

                {(!fileUploadServer.url || fileUploadServer.url.trim() === '') && (
                    <Alert severity="warning" sx={{mb: 2}}>
                        Upload incomplete — please re-upload this image to finalize it.
                    </Alert>
                )}
                {message && message[1] && (
                    <Alert severity={message[0]}>
                        {message[1]}
                    </Alert>
                )}
                <form
                    id={`profile-editor-form-upload-${fileUploadServer.id}`}
                    method="post"
                    ref={formRef}
                    // onChange={handleFormChange}
                    onSubmit={async (e: FormEvent<HTMLFormElement>) => {
                        e.preventDefault();
                        await handleUpdate();
                    }}
                    className="scroll-mt-8"
                >
                    <Stack spacing={2}>
                        <TextField
                            required
                            helperText="Title this image"
                            placeholder="Title this image..."
                            {...formUpload.setupInput('title', 'Title', 'required')}
                        />
                        <TextField
                            multiline
                            minRows={4}
                            helperText="Describe this image"
                            placeholder="Describe this image..."
                            {...formUpload.setupInput('description', 'Description')}
                            slotProps={{
                                htmlInput: {
                                    maxLength: 600,
                                },
                                inputLabel: {
                                    shrink: true
                                }
                            }}
                        />
                        <FormControlLabel
                            control={<Checkbox
                                checked={!!fileUploadClient.feature}
                                {...formUpload.setupInput('feature', 'Feature on Front page')}
                                     />}
                            label="Feature this image on the ArtFair Website"
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={!formUpload.hasUnsavedData}
                            onClick={(e) => {
                                e.preventDefault();
                                handleUpdate().then();
                            }}
                        >
                            Update Image
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            sx={{float: 'right'}}
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            Delete Image
                        </Button>
                    </Stack>
                </form>
            </TableCell>
            <TableCell sx={{position: 'relative', width: '50%'}}>
                {fileUploadServer.url && (
                    <Link href={fileUploadServer.url} target="_blank" rel="noreferrer">
                        <Image
                            loading="lazy"
                            src={fileUploadServer.url}
                            alt={fileUploadClient.title}
                            width={fileUploadServer.width}
                            height={fileUploadServer.height}
                            style={{
                                height: 'auto'
                            }}
                        />
                    </Link>
                )}
            </TableCell>
            <Dialog open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
                <DialogTitle>Confirm delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        {adminMode ? 'Admin action: ' : ''}
                        Are you sure you want to permanently delete this image
                        {fileUploadServer.title ? `: "${fileUploadServer.title}"` : ''}?
                        This cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowDeleteConfirm(false)}>
                        Cancel
                    </Button>
                    <Button color="error" onClick={handleDelete}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </TableRow>
    );
}
