# -*- coding: utf-8 -*-
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
)


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "pdfs" / "places"
OUT.mkdir(parents=True, exist_ok=True)

FONT_REGULAR = "C:/Windows/Fonts/malgun.ttf"
FONT_BOLD = "C:/Windows/Fonts/malgunbd.ttf"
pdfmetrics.registerFont(TTFont("Malgun", FONT_REGULAR))
pdfmetrics.registerFont(TTFont("Malgun-Bold", FONT_BOLD))

PINK = colors.HexColor("#E84F8A")
MINT = colors.HexColor("#E9FBF5")
SOFT_PINK = colors.HexColor("#FFF3F8")
INK = colors.HexColor("#30242D")
MUTED = colors.HexColor("#766A73")
LINE = colors.HexColor("#F0DCE6")

styles = {
    "title": ParagraphStyle(
        "title",
        fontName="Malgun-Bold",
        fontSize=19,
        leading=25,
        textColor=INK,
        spaceAfter=8,
    ),
    "subtitle": ParagraphStyle(
        "subtitle",
        fontName="Malgun",
        fontSize=10.5,
        leading=16,
        textColor=MUTED,
        spaceAfter=10,
    ),
    "h2": ParagraphStyle(
        "h2",
        fontName="Malgun-Bold",
        fontSize=13,
        leading=18,
        textColor=PINK,
        spaceBefore=8,
        spaceAfter=7,
    ),
    "body": ParagraphStyle(
        "body",
        fontName="Malgun",
        fontSize=10,
        leading=15,
        textColor=INK,
    ),
    "small": ParagraphStyle(
        "small",
        fontName="Malgun",
        fontSize=8.5,
        leading=12,
        textColor=MUTED,
    ),
    "box": ParagraphStyle(
        "box",
        fontName="Malgun",
        fontSize=10,
        leading=15,
        textColor=INK,
    ),
}


def checkbox_items(items):
    rows = [[Paragraph(f"□ {item}", styles["body"])] for item in items]
    table = Table(rows, colWidths=[170 * mm])
    table.setStyle(
        TableStyle(
            [
                ("BOX", (0, 0), (-1, -1), 0.7, LINE),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
                ("BACKGROUND", (0, 0), (-1, -1), colors.white),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    return table


def writing_box(label, height=16 * mm):
    table = Table(
        [[Paragraph(label, styles["body"])], [""]],
        colWidths=[170 * mm],
        rowHeights=[9 * mm, height],
    )
    table.setStyle(
        TableStyle(
            [
                ("BOX", (0, 0), (-1, -1), 0.7, LINE),
                ("BACKGROUND", (0, 0), (0, 0), SOFT_PINK),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    return table


def tip_box(text):
    table = Table([[Paragraph(text, styles["box"])]], colWidths=[170 * mm])
    table.setStyle(
        TableStyle(
            [
                ("BOX", (0, 0), (-1, -1), 0.7, colors.HexColor("#BFE9DD")),
                ("BACKGROUND", (0, 0), (-1, -1), MINT),
                ("LEFTPADDING", (0, 0), (-1, -1), 9),
                ("RIGHTPADDING", (0, 0), (-1, -1), 9),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    return table


def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Malgun", 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(18 * mm, 11 * mm, "ToyPoppo 아이와 가볼만한 곳 활동지")
    canvas.drawRightString(192 * mm, 11 * mm, f"{doc.page}")
    canvas.restoreState()


def build_pdf(data):
    path = OUT / data["filename"]
    doc = SimpleDocTemplate(
        str(path),
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=16 * mm,
        bottomMargin=16 * mm,
    )
    story = [
        Paragraph(data["title"], styles["title"]),
        Paragraph(data["intro"], styles["subtitle"]),
        tip_box(data["parent_goal"]),
        Paragraph("1. 현장에서 체크하는 미션카드", styles["h2"]),
        checkbox_items(data["missions"]),
        Spacer(1, 8),
        Paragraph("2. 아이가 고르는 오늘의 한 장면", styles["h2"]),
        writing_box("오늘 가장 오래 보고 싶었던 장면", 15 * mm),
        Spacer(1, 6),
        writing_box("그 장면을 기억하고 싶은 이유", 15 * mm),
        PageBreak(),
        Paragraph(f"{data['short_title']} 관찰노트", styles["title"]),
        Paragraph(
            "방문 후 집에 돌아와 아이와 함께 천천히 적어보세요. 맞고 틀린 답보다 아이의 말과 생각을 이끌어내는 것이 더 중요합니다.",
            styles["subtitle"],
        ),
        Paragraph("3. 생각을 여는 질문", styles["h2"]),
    ]
    for q in data["questions"]:
        story.append(Paragraph(f"• {q}", styles["body"]))
        story.append(Spacer(1, 3))
    story.extend(
        [
            Spacer(1, 5),
            Paragraph("4. 관찰 기록", styles["h2"]),
            writing_box("오늘 새롭게 알게 된 것", 16 * mm),
            Spacer(1, 6),
            writing_box("집에 와서 다시 해보고 싶은 것", 16 * mm),
            Spacer(1, 6),
            writing_box("아이 한마디", 14 * mm),
            Spacer(1, 8),
            Paragraph("5. 집에서 이어가기", styles["h2"]),
            checkbox_items(data["home_activities"]),
            Spacer(1, 8),
            Paragraph(
                "보관 날짜를 적어 파일에 모아두면 아이의 관찰력과 표현력이 자라는 과정을 볼 수 있습니다.",
                styles["small"],
            ),
        ]
    )
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    return path


PDFS = [
    {
        "filename": "arte-museum-gangneung-activity.pdf",
        "short_title": "아르떼뮤지엄 강릉",
        "title": "아르떼뮤지엄 강릉 빛 탐험 활동지",
        "intro": "빛, 소리, 색을 그냥 보고 지나치지 않고 아이의 말과 생각으로 남기기 위한 활동지입니다.",
        "parent_goal": "부모 목표: 아이가 예쁘다, 신기하다에서 멈추지 않고 빛, 소리, 기분, 상상을 말로 표현하도록 도와주세요.",
        "missions": [
            "가장 마음에 드는 색 찾기",
            "바다처럼 보이는 장면 찾기",
            "텍스처가 느껴지는 공간 찾기",
            "소리가 가장 크게 느껴지는 곳 찾기",
            "가장 조용히 보고 싶은 장면 고르기",
            "가족에게 보여주고 싶은 작품 하나 고르기",
            "그림자가 생기는 곳 찾아보기",
            "집에서 다시 만들고 싶은 빛 또는 색 고르기",
        ],
        "questions": [
            "같은 빛을 보고도 사람마다 다른 기분을 느끼는 이유는 무엇일까?",
            "진짜 바다와 빛으로 만든 바다는 어떤 점이 같고 다를까?",
            "이 전시의 제목을 네가 다시 붙인다면 무엇이라고 하고 싶니?",
            "무서워하는 친구에게 이 공간을 어떻게 소개해 주면 좋을까?",
        ],
        "home_activities": [
            "색종이와 투명 파일로 빛 그림자 만들기",
            "오늘 본 색 세 가지로 그림 그리기",
            "느린 음악과 빠른 음악을 맞춰 몸으로 표현하기",
            "나만의 빛 전시 제목 만들기",
        ],
    },
    {
        "filename": "legoland-korea-chuncheon-activity.pdf",
        "short_title": "춘천 레고랜드",
        "title": "춘천 레고랜드 탐험 활동지",
        "intro": "놀이기구를 타고 끝나는 하루가 아니라 아이가 구조, 움직임, 상상력을 말로 정리하도록 돕는 활동지입니다.",
        "parent_goal": "부모 목표: 많이 타기보다 아이가 가장 오래 바라본 구조물과 놀이를 기억하고 집에서 블록 놀이로 이어가게 도와주세요.",
        "missions": [
            "가장 큰 레고 조형물 찾기",
            "빨간색 블록이 많이 보이는 곳 찾기",
            "내가 만들고 싶은 건물 고르기",
            "움직이는 장치가 있는 놀이 찾기",
            "가족에게 보여주고 싶은 장소 고르기",
            "기다리는 동안 블록 모양 찾기 대화하기",
            "집에서 다시 만들고 싶은 장면 정하기",
            "오늘 가장 재미있었던 이유 한 문장 말하기",
        ],
        "questions": [
            "큰 건물을 작은 블록으로 만들 때 가장 먼저 정해야 하는 것은 무엇일까?",
            "재미있는 놀이기구가 되려면 빠르기만 하면 충분할까?",
            "네가 레고랜드 설계자라면 새로 만들고 싶은 구역은 무엇일까?",
            "놀이공원은 놀기만 하는 곳일까, 배울 것도 있는 곳일까?",
        ],
        "home_activities": [
            "오늘 본 놀이기구 하나를 블록으로 다시 만들기",
            "우리 가족만의 놀이공원 지도 그리기",
            "입장권과 안내문을 만들며 역할놀이 하기",
            "가장 기억나는 장면에 제목 붙이기",
        ],
    },
    {
        "filename": "gangneung-hanok-camp-activity.pdf",
        "short_title": "강릉 한옥캠프",
        "title": "강릉 한옥캠프 전통문화 활동지",
        "intro": "한옥을 예쁜 집으로만 보지 않고 구조, 생활, 전통의 의미를 아이가 자기 말로 이해하도록 돕는 활동지입니다.",
        "parent_goal": "부모 목표: 아이가 한옥에서 본 것을 우리 집과 비교하고, 전통을 오늘 생활과 연결해 생각하도록 질문해 주세요.",
        "missions": [
            "기와지붕 모양 관찰하기",
            "마루와 방의 차이 찾기",
            "문살 무늬 하나 그리기",
            "우리 집과 다른 점 세 가지 찾기",
            "가장 마음에 드는 한옥 공간 고르기",
            "옛날 생활 도구나 전통 물건 찾아보기",
            "오늘 배운 전통 단어 하나 말하기",
            "집에서 다시 만들고 싶은 장면 정하기",
        ],
        "questions": [
            "한옥에는 왜 마루와 마당이 필요했을까?",
            "우리 집과 한옥의 편리한 점과 불편한 점은 각각 무엇일까?",
            "오래된 것을 보존하는 일은 왜 중요할까?",
            "전통은 그대로 지켜야 할까, 오늘 생활에 맞게 바뀌어도 될까?",
        ],
        "home_activities": [
            "종이접기로 기와지붕 만들기",
            "나무젓가락과 종이로 문살 무늬 만들기",
            "블록으로 우리 가족 한옥 만들기",
            "우리 집과 한옥 비교표 적기",
        ],
    },
    {
        "filename": "national-museum-kids-docent-activity.pdf",
        "short_title": "국립중앙박물관 도슨트",
        "title": "국립중앙박물관 유물 탐험 활동지",
        "intro": "대표 유물 하나를 골라 시대와 쓰임, 궁금한 점을 아이 말로 남기기 위한 활동지입니다.",
        "parent_goal": "부모 목표: 아이가 설명을 모두 외우기보다 유물 하나를 관찰하고 자기 말로 이유를 말하도록 도와주세요.",
        "missions": [
            "가장 오래되어 보이는 유물 찾기",
            "지금도 쓰임이 비슷한 물건 찾기",
            "왕이나 나라와 관련된 유물 찾기",
            "무늬가 가장 인상적인 유물 고르기",
            "집에 와서 설명하고 싶은 유물 하나 정하기",
            "오늘 배운 시대 이름 하나 말하기",
            "유물을 만든 사람 상상하기",
            "보존해야 할 이유 생각하기",
        ],
        "questions": [
            "이 유물은 누가 어떤 상황에서 사용했을까?",
            "옛날 물건과 지금 물건은 어떤 점이 같고 다를까?",
            "사람들은 왜 이 유물을 지금까지 보존했을까?",
            "박물관은 과거를 보관하는 곳일까, 미래를 생각하게 하는 곳일까?",
        ],
        "home_activities": [
            "오늘 본 유물 하나를 그리고 이름 붙이기",
            "유물의 쓰임을 세 문장으로 설명하기",
            "시대 이름을 연표에 붙여보기",
            "우리 집 물건 중 100년 뒤 남기고 싶은 것 고르기",
        ],
    },
    {
        "filename": "changgyeonggung-moonlight-kids-activity.pdf",
        "short_title": "창경궁 달빛궁궐",
        "title": "창경궁 달빛궁궐 야간투어 활동지",
        "intro": "밤의 궁궐에서 본 길, 소리, 그림자, 역사 이야기를 아이 말로 남기기 위한 활동지입니다.",
        "parent_goal": "부모 목표: 아이가 전각 이름을 모두 외우기보다 밤 궁궐에서 느낀 차이와 공간의 이유를 말하도록 도와주세요.",
        "missions": [
            "가장 기억나는 문이나 전각 찾기",
            "밤에 더 잘 들리는 소리 찾기",
            "조용히 걸어야 하는 이유 말하기",
            "왕이나 궁궐 사람의 하루 상상하기",
            "낮에 다시 와서 보고 싶은 곳 고르기",
            "오늘 들은 역사 단어 하나 기억하기",
            "궁궐에서 가장 넓어 보인 공간 찾기",
            "밤 궁궐을 한 문장으로 표현하기",
        ],
        "questions": [
            "낮의 궁궐과 밤의 궁궐은 무엇이 다르게 느껴질까?",
            "궁궐에는 왜 문과 마당, 전각이 나뉘어 있었을까?",
            "오래된 궁궐을 지금도 보존해야 하는 이유는 무엇일까?",
            "역사는 책으로 배우는 것이 좋을까, 직접 걸어보며 배우는 것이 좋을까?",
        ],
        "home_activities": [
            "창경궁에서 기억나는 길을 지도처럼 그리기",
            "왕의 하루와 나의 하루 비교하기",
            "궁궐에 필요한 약속 세 가지 만들기",
            "야간투어 일기 첫 문장 쓰기",
        ],
    },
]


if __name__ == "__main__":
    for data in PDFS:
        print(build_pdf(data))
