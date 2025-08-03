import type { UploadFile } from 'antd/es/upload/interface'
import { Project as ApiProject } from '../../../api/projects'
import { Enterprise } from '../../../api/enterprises'
import { User } from '../../../api/users'
import { Task } from '../../../api/tasks'

import { Specification } from '../../../components/SpecificationSelector'

export interface FileInfo {
    path: string
    originalName: string
    size: number
}

export type Priority = 'low' | 'medium' | 'high' | 'urgent'

export type ProjectStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'on-hold'

export interface ProjectDetailProps {
    project: ApiProject | null
    tasks: Task[]
    enterprises: Enterprise[]
    employees: User[]
    loading: boolean
    updatingTaskId: string | null
    onSpecificationChange: (taskId: string, specification: Specification | undefined) => Promise<void>
    onProgressChange: (taskId: string, progress: number) => Promise<void>
    onOpenProgressModal: (task: Task) => void
    onProjectFilesChange: (fileList: UploadFile[]) => Promise<void>
}

export interface FileManagementProps {
    projectFiles: UploadFile[]
    clientFiles: UploadFile[]
    projectId?: string
    onProjectFilesChange: (fileList: UploadFile[]) => Promise<void>
}

export interface ProgressModalProps {
    visible: boolean
    editingTask: Task | null
    editingProgress: number
    editingPriority: Priority
    updatingTaskId: string | null
    onOk: () => Promise<void>
    onCancel: () => void
    onProgressChange: (progress: number) => void
    onPriorityChange: (priority: Priority) => void
} 