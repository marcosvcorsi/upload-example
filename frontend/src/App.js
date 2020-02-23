import React, { useState, useEffect } from 'react';
import { uniqueId } from 'lodash';
import filesize from 'filesize';

import GlobalStyle from './styles/global';

import { Container, Content } from './styles'

import Upload from './components/Upload';
import FileList from './components/FileList';

import api from './services/api';

function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    loadData();
  }, [])

  async function loadData() {
    const response = await api.get('/posts');

    if (response && response.data) {
      setUploadedFiles(response.data.map(file => {
        return {
          id: file._id,
          name: file.name,
          readableSize: filesize(file.size),
          uploaded: true,
          url: 'http://www.google.com.br'
        }
      }));
    }
  }

  function handleUpload(files) {
    const filesUploaded = files.map(file => {
      return {
        file,
        id: uniqueId(),
        name: file.name,
        readableSize: filesize(file.size),
        preview: URL.createObjectURL(file),
        progress: 0,
        uploaded: false,
        error: false,
        url: null
      }
    });

    setUploadedFiles([...uploadedFiles, ...filesUploaded]);
    processFiles(filesUploaded);
  }

  function updateFile(fileList, id, data) {
    const newFileList = fileList.map(file => {
      if (file.id === id) {
        return {
          ...file,
          ...data
        }
      }

      return file;
    });

    setUploadedFiles([...uploadedFiles, ...newFileList]);
  }

  function processFiles(filesToUpload) {
    filesToUpload.forEach(fileToUpload => {
      processUpload(fileToUpload, filesToUpload);
    })
  }

  function processUpload(uploadedFile, files) {
    const data = new FormData();
    data.append('file', uploadedFile.file, uploadedFile.name);

    api.post('/posts', data, {
      onUploadProgress: e => {
        const progress = parseInt(Math.round((e.loaded * 100) / e.total));

        updateFile(files, uploadedFile.id, {
          progress,
        })
      }
    }).then(response => {
      updateFile(files, uploadedFile.id, {
        uploaded: true,
        id: response.data._id,
        url: 'http://www.google.com.br'
      });
    }).catch(err => {
      updateFile(files, uploadedFile.id, {
        error: true
      })
    });
  }

  async function handleDelete(id) {
    await api.delete(`/posts/${id}`);

    setUploadedFiles(uploadedFiles.filter(file => file.id !== id));
  }

  return (
    <Container>
      <GlobalStyle />
      <Content>
        <Upload onUpload={handleUpload} />
        {!!uploadedFiles.length && <FileList files={uploadedFiles} onDelete={handleDelete} />}
      </Content>
    </Container>
  );
}

export default App;
