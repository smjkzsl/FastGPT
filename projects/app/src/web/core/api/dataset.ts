import { GET, POST, PUT, DELETE } from '@/web/common/api/request';
import type { DatasetItemType, DatasetsItemType, DatasetPathItemType } from '@/types/core/dataset';
import type {
  DatasetUpdateParams,
  CreateDatasetParams,
  SearchTestProps,
  GetFileListProps,
  UpdateFileProps,
  MarkFileUsedProps,
  PushDataProps,
  UpdateDatasetDataPrams,
  GetDatasetDataListProps
} from '@/global/core/api/datasetReq.d';
import type { SearchTestResponseType, PushDataResponse } from '@/global/core/api/datasetRes.d';
import { DatasetTypeEnum } from '@fastgpt/core/dataset/constant';
import type { DatasetFileItemType } from '@/types/core/dataset/file';
import type { GSFileInfoType } from '@/types/common/file';
import type { QuoteItemType } from '@/types/chat';
import { getToken } from '@/utils/user';
import download from 'downloadjs';
import type { DatasetDataItemType } from '@/types/core/dataset/data';

/* ======================== dataset ======================= */
export const getDatasets = (data: { parentId?: string; type?: `${DatasetTypeEnum}` }) =>
  GET<DatasetsItemType[]>(`/core/dataset/list`, data);

/**
 * get type=dataset list
 */
export const getAllDataset = () => GET<DatasetsItemType[]>(`/core/dataset/allDataset`);

export const getDatasetPaths = (parentId?: string) =>
  GET<DatasetPathItemType[]>('/core/dataset/paths', { parentId });

export const getDatasetById = (id: string) => GET<DatasetItemType>(`/core/dataset/detail?id=${id}`);

export const postCreateDataset = (data: CreateDatasetParams) =>
  POST<string>(`/core/dataset/create`, data);

export const putDatasetById = (data: DatasetUpdateParams) => PUT(`/core/dataset/update`, data);

export const delDatasetById = (id: string) => DELETE(`/core/dataset/delete?id=${id}`);

export const postSearchText = (data: SearchTestProps) =>
  POST<SearchTestResponseType>(`/core/dataset/searchTest`, data);

/* ============================= file ==================================== */
export const getDatasetFiles = (data: GetFileListProps) =>
  POST<DatasetFileItemType[]>(`/core/dataset/file/list`, data);
export const delDatasetFileById = (params: { fileId: string; kbId: string }) =>
  DELETE(`/core/dataset/file/delById`, params);
export const getFileInfoById = (fileId: string) =>
  GET<GSFileInfoType>(`/core/dataset/file/detail`, { fileId });
export const delDatasetEmptyFiles = (kbId: string) =>
  DELETE(`/core/dataset/file/delEmptyFiles`, { kbId });

export const updateDatasetFile = (data: UpdateFileProps) => PUT(`/core/dataset/file/update`, data);

export const putMarkFilesUsed = (data: MarkFileUsedProps) =>
  PUT(`/core/dataset/file/markUsed`, data);

/* =============================== data ==================================== */

/* kb data */
export const getDatasetDataList = (data: GetDatasetDataListProps) =>
  POST(`/core/dataset/data/getDataList`, data);

/**
 * export and download data
 */
export const exportDatasetData = (data: { kbId: string }) =>
  fetch(`/api/core/dataset/data/exportAll?kbId=${data.kbId}`, {
    method: 'GET',
    headers: {
      token: getToken()
    }
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || 'Export failed');
      }
      return res.blob();
    })
    .then((blob) => download(blob, 'dataset.csv', 'text/csv'));

/**
 * 获取模型正在拆分数据的数量
 */
export const getTrainingData = (data: { kbId: string; init: boolean }) =>
  POST<{
    qaListLen: number;
    vectorListLen: number;
  }>(`/core/dataset/data/getTrainingData`, data);

/* get length of system training queue */
export const getTrainingQueueLen = () => GET<number>(`/core/dataset/data/getQueueLen`);

export const getDatasetDataItemById = (dataId: string) =>
  GET<QuoteItemType>(`/core/dataset/data/getDataById`, { dataId });

/**
 * push data to training queue
 */
export const postChunks2Dataset = (data: PushDataProps) =>
  POST<PushDataResponse>(`/core/dataset/data/pushData`, data);

/**
 * insert one data to dataset (immediately insert)
 */
export const postData2Dataset = (data: { kbId: string; data: DatasetDataItemType }) =>
  POST<string>(`/core/dataset/data/insertData`, data);

/**
 * 更新一条数据
 */
export const putDatasetDataById = (data: UpdateDatasetDataPrams) =>
  PUT('/core/dataset/data/updateData', data);
/**
 * 删除一条知识库数据
 */
export const delOneDatasetDataById = (dataId: string) =>
  DELETE(`/core/dataset/data/delDataById?dataId=${dataId}`);
