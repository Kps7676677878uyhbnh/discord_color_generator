

import React, { useState, useRef } from 'react';
import { Title, Text, Button, Group, Tooltip, Container } from '@mantine/core';
import './App.css';

const App = () => {
  const textareaRef = useRef(null);
  const [tooltip, setTooltip] = useState({ visible: false, text: '', top: 0, left: 0 });
  const [copyCount, setCopyCount] = useState(0);

  const tooltipTexts = {
    '30': 'Dark Gray', '31': 'Red', '32': 'Yellowish Green', '33': 'Gold',
    '34': 'Light Blue', '35': 'Pink', '36': 'Teal', '37': 'White',
    '40': 'Blueish Black', '41': 'Rust Brown', '42': 'Gray', '43': 'Grayish Blue',
    '44': 'Steel Blue', '45': 'Blurple', '46': 'Light Gray', '47': 'Cream White',
  };

  const styleButtons = [
    { ansi: '0', label: 'Reset All' },
    { ansi: '1', label: 'Bold', className: 'ansi-1' },
    { ansi: '4', label: 'Line', className: 'ansi-4' },
  ];

  const fgButtons = [
    { ansi: '30', bg: '#4f545c' }, { ansi: '31', bg: '#dc322f' }, { ansi: '32', bg: '#859900' },
    { ansi: '33', bg: '#b58900' }, { ansi: '34', bg: '#268bd2' }, { ansi: '35', bg: '#d33682' },
    { ansi: '36', bg: '#2aa198' }, { ansi: '37', bg: '#ffffff' },
  ];

  const bgButtons = [
    { ansi: '40', bg: '#002b36' }, { ansi: '41', bg: '#cb4b16' }, { ansi: '42', bg: '#586e75' },
    { ansi: '43', bg: '#657b83' }, { ansi: '44', bg: '#839496' }, { ansi: '45', bg: '#6c71c4' },
    { ansi: '46', bg: '#93a1a1' }, { ansi: '47', bg: '#fdf6e3' },
  ];

  const handleStyleClick = (ansi) => {
    const textarea = textareaRef.current;
    if (ansi === '0') {
      textarea.innerHTML = '';  // Reset content
      return;
    }

    const selection = window.getSelection();
    const text = selection.toString();
    if (!text) return;

    const span = document.createElement('span');
    span.innerText = text;
    span.classList.add(`ansi-${ansi}`);

    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(span);

    range.selectNodeContents(span);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const handleMouseEnter = (ansi, event) => {
    if (ansi <= 4) return;
    const rect = event.target.getBoundingClientRect();
    setTooltip({
      visible: true,
      text: tooltipTexts[ansi],
      top: rect.top - 36,
      left: rect.left - 50 + rect.width / 2, 
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, text: '', top: 0, left: 0 });
  };

  const nodesToANSI = (nodes, states) => {
    let text = '';
    for (const node of nodes) {
      if (node.nodeType === 3) {
        text += node.textContent;
        continue;
      }
      if (node.nodeName === 'BR') {
        text += '\n';
        continue;
      }
      const ansiCode = parseInt(node.className.split('-')[1], 10);
      const newState = { ...states[states.length - 1] };

      if (ansiCode < 30) newState.st = ansiCode;
      if (ansiCode >= 30 && ansiCode < 40) newState.fg = ansiCode;
      if (ansiCode >= 40) newState.bg = ansiCode;

      states.push(newState);
      text += `\x1b[${newState.st};${ansiCode >= 40 ? newState.bg : newState.fg}m`;
      text += nodesToANSI(node.childNodes, states);
      states.pop();
      text += '\x1b[0m';

      if (states[states.length - 1].fg !== 2) text += `\x1b[${states[states.length - 1].st};${states[states.length - 1].fg}m`;
      if (states[states.length - 1].bg !== 2) text += `\x1b[${states[states.length - 1].st};${states[states.length - 1].bg}m`;
    }
    return text;
  };

  const handleCopy = () => {
    const toCopy = '```ansi\n' + nodesToANSI(textareaRef.current.childNodes, [{ fg: 2, bg: 2, st: 2 }]) + '\n```';
    navigator.clipboard.writeText(toCopy).then(() => {
      const funnyCopyMessages = [
        'Copied!', 'Double Copy!', 'Triple Copy!', 'Dominating!!', 'Rampage!!',
        'Mega Copy!!', 'Unstoppable!!', 'Wicked Sick!!', 'Monster Copy!!!', 'GODLIKE!!!',
        'BEYOND GODLIKE!!!!', Array(16).fill(0).reduce((p) => p + String.fromCharCode(Math.floor(Math.random() * 65535)), ''),
      ];
      setCopyCount((prev) => Math.min(11, prev + 1));
      setTimeout(() => setCopyCount(0), 2000);
    }).catch(() => {
      if (copyCount <= 2) alert(`Copy failed. Try copying this manually:\n${toCopy}`);
    });
  };

  return (
    <div style={{ backgroundColor: '#36393F', minHeight: '100vh', color: '#FFF', textAlign: 'center', padding: '20px' }}>
      <Title order={1}>Discord <Text component="span" color="#5865F2">ANSI</Text> Text Generator</Title>

      <Container size="sm" my="lg">
        <Text>Create colorful Discord messages with ANSI codes.</Text>
      </Container>

      <div style={{ margin: '20px 0' }}>
        <Group spacing="xs">
          {styleButtons.map((btn) => (
            <Button key={btn.ansi} variant="filled" color="green" onClick={() => handleStyleClick(btn.ansi)}>
              {btn.label}
            </Button>
          ))}
        </Group>

        <Group spacing="xs" mt="md">
          <Text>Foreground:</Text>
          {fgButtons.map((btn) => (
            <Tooltip key={btn.ansi} label={tooltipTexts[btn.ansi]} position="top">
              <Button
                variant="filled"
                style={{ backgroundColor: btn.bg }}
                onClick={() => handleStyleClick(btn.ansi)}
                onMouseEnter={(e) => handleMouseEnter(btn.ansi, e)}
                onMouseLeave={handleMouseLeave}
              >
                 
              </Button>
            </Tooltip>
          ))}
        </Group>

        <Group spacing="xs" mt="md">
          <Text>Background:</Text>
          {bgButtons.map((btn) => (
            <Tooltip key={btn.ansi} label={tooltipTexts[btn.ansi]} position="top">
              <Button
                variant="filled"
                style={{ backgroundColor: btn.bg }}
                onClick={() => handleStyleClick(btn.ansi)}
              >
                 
              </Button>
            </Tooltip>
          ))}
        </Group>
      </div>

      {/* <div
        ref={textareaRef}
        contentEditable

        
        style={{ 
          width: '600px', height: '200px', border: '1px solid #ccc', padding: '10px',
          backgroundColor: '#2F3136', color: '#B9BBBE', fontFamily: 'monospace'
        }}
        
      /> */}
      <div id="textarea"   style={{ 
          width: '600px', height: '200px', border: '1px solid #ccc', padding: '10px',
          backgroundColor: '#2F3136', color: '#B9BBBE', fontFamily: 'monospace'
        }} contenteditable="true">Welcome to&nbsp;<span class="ansi-33">Rebane</span>'s <span class="ansi-45"><span class="ansi-37">Discord</span></span>&nbsp;<span class="ansi-31">C</span><span class="ansi-32">o</span><span class="ansi-33">l</span><span class="ansi-34">o</span><span class="ansi-35">r</span><span class="ansi-36">e</span><span class="ansi-37">d</span>&nbsp;Text Generator!</div>
      
   

      <Button onClick={handleCopy} mt="md">Copy text as Discord formatted</Button>
    </div>
  );
};

export default App;



