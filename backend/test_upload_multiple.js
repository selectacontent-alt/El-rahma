async function test() {
  try {
    const form = new FormData();
    form.append('files', new Blob(['test1'], { type: 'image/jpeg' }), 'test1.jpg');
    form.append('files', new Blob(['test2'], { type: 'image/jpeg' }), 'test2.jpg');
    form.append('multiple', 'true');
    
    const uploadRes = await fetch('http://localhost:5005/api/admin/upload/drive', {
      method: 'POST',
      body: form
    });
    
    const text = await uploadRes.text();
    console.log('Upload Status:', uploadRes.status);
    console.log('Upload Response:', text);
  } catch(e) {
    console.error(e);
  }
}
test();
