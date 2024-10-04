from pyvi import ViTokenizer, ViPosTagger
from pyvi import ViUtils

tokenize = ViTokenizer.tokenize(u"Mùa thu mang giấc mơ quay về")
print(tokenize)

postagging = ViPosTagger.postagging(ViTokenizer.tokenize(u"Vẫn nguyên vẹn như hôm nào"))
print(postagging)

remove_accents = ViUtils.remove_accents(u"Gió bay theo lá xôn xao")
print(remove_accents)

add_accents = ViUtils.add_accents(u'thien ly oi em co the o lai day khong')
print(add_accents)