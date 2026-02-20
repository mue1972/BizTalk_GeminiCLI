document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const charCount = document.getElementById('charCount');
    const convertButton = document.getElementById('convertButton');
    const outputText = document.getElementById('outputText');
    const copyButton = document.getElementById('copyButton');
    const personaRadios = document.querySelectorAll('input[name="persona"]');

    const API_ENDPOINT = 'http://127.0.0.1:5001/api/convert'; // Flask backend URL

    // Character count update
    inputText.addEventListener('input', () => {
        const currentLength = inputText.value.length;
        charCount.textContent = `${currentLength}/500`;
    });

    // Convert text
    convertButton.addEventListener('click', async () => {
        const text = inputText.value;
        let selectedPersona = '';
        for (const radio of personaRadios) {
            if (radio.checked) {
                selectedPersona = radio.value;
                break;
            }
        }

        if (!text) {
            alert('변환할 내용을 입력해주세요.');
            return;
        }
        if (!selectedPersona) {
            alert('수신자를 선택해주세요.');
            return;
        }

        convertButton.disabled = true;
        convertButton.textContent = '변환 중...';

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: text, target: selectedPersona }),
            });

            const data = await response.json();

            if (response.ok) {
                outputText.value = data.converted_text;
            } else {
                alert(`Error: ${data.error || '알 수 없는 오류가 발생했습니다.'}`);
            }
        } catch (error) {
            console.error('Error converting text:', error);
            alert('API 호출 중 오류가 발생했습니다.');
        } finally {
            convertButton.disabled = false;
            convertButton.textContent = '변환하기';
        }
    });

    // Copy to clipboard
    copyButton.addEventListener('click', () => {
        if (outputText.value) {
            outputText.select();
            outputText.setSelectionRange(0, 99999); // For mobile devices
            document.execCommand('copy');
            alert('변환된 텍스트가 복사되었습니다!');
        } else {
            alert('복사할 내용이 없습니다.');
        }
    });
});
