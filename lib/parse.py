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

        # 1. シーンの切り替え
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
                left_side = line
                next_scene = current_scene 

            choice_text = left_side.replace("-", "", 1).strip()

            scenario[current_scene]["choices"].append({
                "text": choice_text,
                "next": next_scene
            })
            continue

        # 3. 通常のメッセージ解析 (名前: セリフ [-> 次のシーン])
        if ":" in line or "：" in line:
            splitter = ":" if ":" in line else "："
            username, rest = line.split(splitter, 1)
            
            username = username.strip()
            if username == "":
                username = "神崎"
            
            # メッセージ部分に 「->」 が含まれているかチェック
            msg_next_scene = None
            if "->" in rest:
                content_part, msg_next_scene = rest.split("->", 1)
                content = content_part.strip()
                msg_next_scene = msg_next_scene.strip()
            else:
                content = rest.strip()
            
            # メッセージを追加
            message_data = {
                "username": username,
                "content": content
            }
            # もし「-> 次のシーン」があれば、メッセージのデータに持たせる
            if msg_next_scene:
                message_data["next"] = msg_next_scene
                
            scenario[current_scene]["npc_messages"].append(message_data)

    # JSONファイルへ書き出し
    with open(json_file_path, "w", encoding="utf-8") as f:
        json.dump(scenario, f, indent=2, ensure_ascii=False)

    print(f"👁️ 因果律の固定に成功した。メッセージ遷移も対応したぞ。")

# 実行
markdown_to_scenario_json("scenario.md", "scenario.json")