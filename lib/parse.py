import json

def markdown_to_scenario_json(md_file_path, json_file_path):
    with open(md_file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    scenario = {}
    current_scene = None

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # 1. シーンの切り替え (# シーン名)
        if line.startswith("#"):
            current_scene = line.replace("#", "").strip()
            scenario[current_scene] = {"npc_messages": [], "choices": []}
            continue

        if current_scene is None:
            continue

        # 2. 選択肢の解析 (- 選択肢テキスト -> 次のシーン)
        if line.startswith("-"):
            if "->" in line:
                left_side, next_scene = line.split("->", 1)
                next_scene = next_scene.strip()
            else:
                # 行き先がない場合は、エラー回避のために現在のシーンを設定
                left_side = line
                next_scene = current_scene 

            # 先頭の「-」を取り除き、お前が書いた文字をそのまま生かす（カギ括弧は付けない）
            choice_text = left_side.replace("-", "", 1).strip()

            scenario[current_scene]["choices"].append({
                "text": choice_text,  # 🌟生のテキストをそのまま注入！
                "next": next_scene
            })
            continue

        # 3. 通常のメッセージ解析 (名前: セリフ)
        if ":" in line or "：" in line:
            splitter = ":" if ":" in line else "："
            username, content = line.split(splitter, 1)
            if(username==""):
                username="神崎"
            
            scenario[current_scene]["npc_messages"].append({
                "username": username.strip(),
                "content": content.strip()
            })

    # JSONファイルへ書き出し
    with open(json_file_path, "w", encoding="utf-8") as f:
        json.dump(scenario, f, indent=2, ensure_ascii=False)

    print(f"👁️ 因果律の固定に成功した。カギ括弧無しの世界線だ。")

# 実行
markdown_to_scenario_json("scenario.md", "scenario.json")