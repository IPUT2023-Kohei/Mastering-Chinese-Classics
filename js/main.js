$(function() {
    let correctanswer = 0; // 正解数をカウント
    let totalquestion = 5; // 出題数を固定
    let countq = 0; // 現在の問題数
    let results = []; // 解答結果を保存する配列
    let currentDifficulty; // 現在の難易度
    let problemData; // 現在の問題データ
    let hintSetting = "none"; // ヒントの設定（初期値は「無」）
    
    //難易度別のヒント表示時間
    let hintOfauto = {
        easy : 30000,
        normal : 45000,
        hard : 60000
    };

    //ヒント
    let hints = {
            easy: "この問題は基本的な知識を問うものです。よく考えてみてください。",
            normal: "少し考えればわかるはずです。関連する情報を思い出してみてください。",
            hard: "この問題は複雑です。異なる視点から考えてみると良いかもしれません。"
        };

    // スタートボタン押下時
    $("#startButton").on('click', function() {
        $("#title").hide(); // タイトル画面を非表示
        $(".nanido").show(); // 難易度選択を表示
        $("#hintButton").hide(); // ヒントボタンを非表示
    });

    // 難易度ボタン押下時
    $("#easy").on('click', function() {
        startGame("簡単");
    });
    $("#normal").on('click', function() {
        startGame("普通");
    });
    $("#hard").on('click', function() {
        startGame("難問");
    });

    //設定ボタン押下時
    $('#set').on('click', function(){
        $("#title").hide(); // タイトル画面を非表示
        $(".setting").show();
    })

    /// ヒントボタンの設定
    $("#yes").on('click', function() {
        hintSetting = "yes"; // ヒントボタンを表示する設定
    });

    $("#no").on('click', function() {
        hintSetting = "no"; // ヒントボタンを非表示にする設定
    });

    $("#auto").on('click', function() {
        hintSetting = "auto"; // 1分後にヒントを表示する設定
    });

    // 確定ボタン押下時
    $("#confirm").on('click', function() {
        // 設定を確定させる
        if (hintSetting === "yes") {
            $("#hintButton").show(); // ヒントボタンを表示
        } else if (hintSetting === "no") {
            $("#hintButton").hide(); // ヒントボタンを非表示
        } else if (hintSetting === "auto") {
            $("#hintButton").hide(); // ヒントボタンを非表示
        }

        // 設定画面を非表示にしてゲームを開始
        $(".setting").hide(); // 設定画面を非表示
        $(".nanido").show();
    });

    //ヒントボタン
    $("#hintButton").on(`click`, function(){
        showHint();
    })

    // ヒントを表示する関数
    function showHint() {
        let hintMessage;
        if (currentDifficulty === "簡単") {
            hintMessage = hints.easy;
        } else if (currentDifficulty === "普通") {
            hintMessage = hints.normal;
        } else if (currentDifficulty === "難問") {
            hintMessage = hints.hard;
        }

        // ヒントを表示
        alert(hintMessage);
    }

     // ゲームを開始する関数
     function startGame(difficulty) {
        currentDifficulty = difficulty; // 現在の難易度を設定
        $(".nanido").hide(); // 難易度選択を非表示
        $("#mondai").show(); // 問題画面を表示
        displayRandomQ(difficulty); // 最初の問題を表示
    }

    // ランダムに問題を選ぶ関数
    function getRandomQ(difficulty) {
        let questions;
        if (difficulty === "簡単") {
            questions = easy_q;
        } else if (difficulty === "普通") {
            questions = normal_q;
        } else if (difficulty === "難問") {
            questions = hard_q;
        }
    
        if (questions && questions.length > 0) {
            const randomIndex = Math.floor(Math.random() * questions.length);
            console.log("取得した問題:", questions[randomIndex]); // デバッグ用
            return questions[randomIndex];
        }
        return null; // 無効な難易度または空の配列の場合
    }

    // 問題を表示する関数
    function displayRandomQ(difficulty) {
        problemData = getRandomQ(difficulty); // ランダムに問題を取得
        if (problemData) {
            $('#sortable-list').empty(); // 選択肢リストをクリア

            // 問題の選択肢を表示
        problemData.q_k.forEach((item, index) => {
            if (typeof item === 'number') {
                // 数字の場合はsortable-itemクラスを追加
                $('#sortable-list').append(`<li id="item-${index}" class="sortable-item">${item}</li>`);
            } else {
                // 文字の場合はnon-sortable-itemクラスを追加
                $('#sortable-list').append(`<li id="item-${index}" class="non-sortable-item">${item}</li>`);
            }
        });

        // Sortableを初期化
        $('#sortable-list').sortable({
            items: '.sortable-item', // sortable-itemクラスのアイテムだけを動かせるようにする
            cancel: '.non-sortable-item' // non-sortable-itemクラスのアイテムは動かせないようにする
        });

            // ユーザーが選択肢を選べるようにするためのイベントを追加
            $('#sortable-list li').on('click', function() {
                $('#sortable-list li').removeClass('selected'); // すべての選択肢から選択を解除
                $(this).addClass('selected'); // クリックした選択肢を選択状態にする
            });
        } else {
            alert("問題が取得できませんでした。");
        }

        // ヒント設定が"auto"の場合
        if (hintSetting === "auto") {
            if(difficulty == "簡単"){
                setTimeout(function() {
                    showHint();
                }, hintOfauto.easy);
            } else if(difficulty === "普通"){
                setTimeout(function() {
                    showHint();
                }, hintOfauto.normal);
            } else {
                setTimeout(function() {
                    showHint();
                }, hintOfauto.hard);
            }
        }
    }

   /* 提出ボタン押下時
    $("#teisyutuButton").on('click', function() {
        const userAnswer = getUserAnswer(); // ユーザーの選択を取得
        const correctAnswer = problemData.q_a; // 正しい答えを取得

        // ユーザーの解答を保存
        results.push({
            question: problemData.q_k.join(", "), // 問題の選択肢を保存
            userAnswer: userAnswer, // ユーザーの解答を保存
            correct: userAnswer === correctAnswer, // 正解かどうかを保存
            correctAnswer: correctAnswer // 正しい答えを保存
        });

        if (userAnswer === correctAnswer) {
            // 正解の場合
            correctanswer++; // 正解数をカウント
            alert("正解です！");
        } else {
            // 不正解の場合
            alert(`不正解です。正しい答えは ${correctAnswer.join(", ")} です。`);
            // 難問を選択した場合は解説を表示せずに次の問題へ進む
            if (currentDifficulty === "難問") {
                countq++; // 問題数をカウント
                if (countq >= totalquestion) {
                    alert("結果発表に進みます。")
                    $("#resultButton").show(); // 結果発表ボタンを表示
                } else {
                    alert("次の問題に進みます。");
                    $("#nextButton").show(); // 次の問題ボタンを表示
                }
                $("#teisyutuButton").hide(); // 提出ボタンを非表示
                return; // 解説を表示せずに処理を終了
            } else {
                // 解説を表示
                showExplanation(); // 解説を表示
            }
        }

        countq++; // 問題数をカウント
        if (countq >= totalquestion) {
            // すべての問題が終了したら結果発表ボタンを表示
            $("#resultButton").show(); // 結果発表ボタンを表示
        } else {
            $("#nextButton").show(); // 次の問題ボタンを表示
        }
        $("#teisyutuButton").hide(); // 提出ボタンを非表示
    });*/

    // 提出ボタン押下時
    $("#teisyutuButton").on('click', function() {
        const userAnswer = getUserAnswer(); // ユーザーの選択を取得
        const correctAnswer = problemData.q_a; // 正しい答えを取得

        // ユーザーの解答を保存
        results.push({
            question: problemData.q_k.join(", "), // 問題の選択肢を保存
            userAnswer: userAnswer, // ユーザーの解答を保存
            correct: false, // 初期値は不正解
            correctAnswer: correctAnswer // 正しい答えを保存
        });

        // 正誤判定
        let isCorrect = false;

        // 正しい答えが配列の場合
        if (Array.isArray(correctAnswer)) {
            // ユーザーの選択が配列である場合
            if (Array.isArray(userAnswer)) {
                isCorrect = correctAnswer.length === userAnswer.length && correctAnswer.every((val, index) => val === userAnswer[index]);
            } else {
                // ユーザーの選択が文字列の場合、配列に変換して比較
                isCorrect = correctAnswer.includes(userAnswer);
            }
        } else {
            // 正しい答えが文字列の場合
            isCorrect = userAnswer === correctAnswer;
        }

        // 判定結果を保存
        results[results.length - 1].correct = isCorrect;

        if (isCorrect) {
            // 正解の場合
            correctanswer++; // 正解数をカウント
            alert("正解です！");
        } else {
            // 不正解の場合
            alert(`不正解です。正しい答えは ${Array.isArray(correctAnswer) ? correctAnswer.join(", ") : correctAnswer} です。`);
            // 難問を選択した場合は解説を表示せずに次の問題へ進む
            if (currentDifficulty === "難問") {
                countq++; // 問題数をカウント
                if (countq >= totalquestion) {
                    alert("結果発表に進みます。")
                    $("#resultButton").show(); // 結果発表ボタンを表示
                } else {
                    alert("次の問題に進みます。");
                    $("#nextButton").show(); // 次の問題ボタンを表示
                }
                $("#teisyutuButton").hide(); // 提出ボタンを非表示
                return; // 解説を表示せずに処理を終了
            } else {
                // 解説を表示
                showExplanation(); // 解説を表示
            }
        }

        countq++; // 問題数をカウント
        if(countq >= totalquestion) {
            // 5問終了したら結果発表ボタンを表示
            $("#teisyutuButton").hide(); // 提出ボタンを非表示
            $("#nextButton").hide(); // 次の問題ボタンを非表示
            $("#resultButton").show(); // 結果発表ボタンを表示
        } else {
            $("#nextButton").show(); // 次の問題ボタンを表示
            $("#teisyutuButton").hide(); // 提出ボタンを非表示
        }
    });

    // 次の問題ボタン押下時
    $("#nextButton").on('click', function() {
        $("#wrong").hide(); // 解説画面を非表示
        $("#mondai").show(); // 問題画面を表示

        displayRandomQ(currentDifficulty); // 次の問題を表示

        $("#nextButton").hide(); // 次の問題ボタンを非表示
        $("#teisyutuButton").show(); // 提出ボタンを再表示
    });

    // 結果発表ボタン押下時
    $("#resultButton").on('click', function() {
        $("#mondai").hide(); // 問題画面を非表示
        $("#result").show(); // 結果画面を表示
        displayResults(); // 結果を表示する関数を呼び出す
    });

    // 結果を表示する関数
    function displayResults() {
        $("#answerList").empty(); // 結果リストをクリア
        results.forEach(result => {
            if (result.correct) {
                $("#answerList").append(`<li>${result.question} - 正解</li>`);
            } else {
                $("#answerList").append(`<li>${result.userAnswer} 不正解 (正しい答え: ${result.correctAnswer.join(", ")})</li>`);
            }
        });
        $("#score").text(`正解数: ${correctanswer} / ${totalquestion}`); // スコアを表示

        if(correctanswer == totalquestion){
            alert("全問正解だ!君の力は本当に素晴らしい!");
        } else if(correctanswer == 4){
            alert("素晴らしい結果だ!次は全てを勝ち取ろう!");
        } else if(correctanswer == 3){
            alert("3問正解は素晴らしい!君の努力が実を結んだな!");
        } else if(correctanswer == 2){
            alert("君の努力は無駄じゃない!次はもっと高みを目指そう!");
        } else if(correctanswer == 1){
            alert("1つの正解でも、君の努力は無駄じゃない!頑張ろう!");
        } else {
            alert("失敗は成功のもとだ!次はもっと頑張ろう!");
        }
    }

    // 解説を表示する関数
    function showExplanation() {
        let explanation = "";
        let timeToNextQuestion = 30000; //30秒
        if (currentDifficulty == "簡単") {
            if (problemData.ex_1) {
                explanation = problemData.ex_1; // ex_1が存在する場合
            } else if (problemData.ex_2) {
                explanation = problemData.ex_2; // ex_2が存在する場合
            } else if (problemData.ex_3) {
                explanation = problemData.ex_3; // ex_3が存在する場合
            }
        } else if (currentDifficulty == "普通") {
            let explanationsArray = []; // 解説を格納する配列
        
            if (problemData.ex_1) {
                explanationsArray.push(problemData.ex_1); // ex_1が存在する場合
            }
            if (problemData.ex_2) {
                explanationsArray.push(problemData.ex_2); // ex_2が存在する場合
            }
            if (problemData.ex_3) {
                explanationsArray.push(problemData.ex_3); // ex_3が存在する場合
            }
        
            // 配列が空でない場合、解説を結合
            if (explanationsArray.length > 0) {
                explanation = explanationsArray.join("<br>"); // 改行で結合
            }
        }
    
        $("#explain").html(explanation); // 解説内容を設定
        $("#wrong").show(); // 解説画面を表示
        $("#mondai").hide(); // 問題画面を非表示にする
        // カウントダウンの表示を初期化
        let count = timeToNextQuestion/1000;
        let countdownElement = $("#count");
        countdownElement.text(count + "秒");

        // カウントダウンのタイマーを設定
        let countdownInterval = setInterval(function() {
            count--;
            countdownElement.text(count + "秒");
            
            if (countdownTime <= 0) {
                clearInterval(countdownInterval); // タイマーをクリア
            }
        }, 1000); // 1秒ごとに更新

        // 解説画面を表示した後、次の問題に進むためのタイマーを設定
        setTimeout(function() {
            clearInterval(countdownInterval); // タイマーをクリア
            $("#wrong").hide(); // 解説画面を非表示
            $("#mondai").show(); // 問題画面を表示
            displayRandomQ(currentDifficulty); // 次の問題を表示
            if(countq >= totalquestion){
                $("#teisyutuButton").hide();
            } else {
                $("#teisyutuButton").show(); // 提出ボタンを再表示
            }
            $("#nextButton").hide(); // 次の問題ボタンを非表示
        }, timeToNextQuestion);
    }
    // ユーザーの選択を取得する関数
    function getUserAnswer() {
        const selectedAnswer = $('#sortable-list li.selected').text(); // 選択されたリストアイテムのテキストを取得
        return selectedAnswer; // ユーザーの選択を返す
    }
});

//注意事項のボタン
document.addEventListener("DOMContentLoaded", function() {
    // 注意事項のボタン
    document.getElementById("tips").addEventListener('click', function(event) {
        event.preventDefault(); // デフォルトの動作を防ぐ

        // 要素の存在確認
        const titleElement = document.getElementById("title");
        const tipElement = document.getElementById("tip");
        const outputElement = document.getElementById("output");
        const output1Element = document.getElementById("output1");
        const output1_1Element = document.getElementById("output1.1");
        const output2Element = document.getElementById("output2");
        const output3Element = document.getElementById("output3");
        const prElement = document.getElementById("pr");
        const pr1Element = document.getElementById("pr1");
        const pr2Element = document.getElementById("pr2");
        const pr3Element = document.getElementById("pr3");
        const pr4Element = document.getElementById("pr4");

        if (titleElement) {
            titleElement.style.display = 'none'; // タイトルを非表示
        }
        if (tipElement) {
            tipElement.style.display = 'block'; // 注意事項を表示
        }
        if (outputElement) {
            outputElement.textContent = "注意事項"; // 注意事項のタイトル
        }
        if (output1Element) {
            output1Element.textContent = "以下のやり方をしないと提出しても不正解扱いになります!?"; // 注意事項の説明
        }
        if (output1_1Element) {
            output1_1Element.textContent = "1.どれか数字（アラビア数字）が入っているものクリック"; // 手順1
        }
        if (output2Element) {
            output2Element.textContent = "2.何もないところをクリック"; // 手順2
        }
        if (output3Element) {
            output3Element.textContent = "※返り点は最初にあった場所を覚えてください"; // 
        }
        if (prElement) {
            prElement.textContent = "アラビア数字とは";
        }
        if (pr1Element) {
            pr1Element.textContent = "・アラビア数字は0から9までの10種類の数字。";
        }
        if (pr2Element) {
            pr2Element.textContent = "・インド数字がアラビアを経由してヨーロッパに広まった。";
        }
        if (pr3Element) {
            pr3Element.textContent = "・数学や科学、ビジネスなど多くの分野で利用される。";
        }
        if (pr4Element) {
            pr4Element.textContent = "・他の数字体系（漢数字など）と区別される。";
        }
    });
});