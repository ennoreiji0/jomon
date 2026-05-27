const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

// パスを設定（CSVの場所と、出力するJSONの場所）
const CSV_FILE_PATH = path.join(__dirname, '../data/scenario.csv');
const JSON_OUTPUT_PATH = path.join(__dirname, '../data/scenario.json');

function convertCsvToJson() {
  const fileContent = fs.readFileSync(CSV_FILE_PATH, 'utf-8');
  
  // CSVをパースしてオブジェクトの配列にする（1行目がヘッダーになる）
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });

  const scenario = {};

  records.forEach((row) => {
    const { route_id, username, content, choice_text, choice_next } = row;

    // まだ登録されていないルートIDなら初期化
    if (!scenario[route_id]) {
      scenario[route_id] = {
        npc_messages: [],
        choices: []
      };
    }

    // メッセージ（発言者とセリフ）があれば追加
    if (username && content) {
      scenario[route_id].npc_messages.push({
        username: username.trim(),
        content: content.trim()
      });
    }

    // 選択肢（テキストと遷移先）があれば追加
    if (choice_text && choice_next) {
      scenario[route_id].choices.push({
        text: choice_text.trim(),
        next: choice_next.trim()
      });
    }
  });

  // JSONファイルとして書き出し
  fs.writeFileSync(JSON_OUTPUT_PATH, JSON.stringify(scenario, null, 2), 'utf-8');
  console.log('✅ シナリオのJSON変換が完了したぜ！');
}

convertCsvToJson();