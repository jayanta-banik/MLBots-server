# @DarkSourceOfCode
# This bash scripts creats a newly formatted Raspberrypi into a MLBOT system
# 

# change the splash screen
echo "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣤⡤⠴⠖⠒⠂⠈⠉⠉⠁⠒⠒⠒⠲⠤⠤⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⠴⡾⠛⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠓⢦⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣶⣿⣿⣿⡾⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠷⣦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⠟⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠳⢄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣾⠟⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣠⣤⣤⣶⣶⣾⣿⣿⣿⣿⣿⣶⣶⣤⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠋⠛⠁⠀⠀⠀⠀⠀⠀⠀⣠⣴⣲⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣤⡀⠀⠀⠀⠀⠀⠀⠳⣾⣿⣣⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠞⠁⠀⠀⠀⠀⠀⠀⠀⣠⣔⢿⣿⣿⣿⣿⠿⠟⠛⣩⠉⣉⣉⡱⡄⠈⠉⡍⠉⠛⠻⢿⣿⣿⣿⣿⣿⣷⣄⡀⠀⠀⠀⠀⠈⢻⡙⢮⢄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡴⠃⠀⠀⠀⠀⠀⠀⠀⣠⣾⣿⣿⣿⡿⠟⠉⠰⠂⠀⠀⣀⣀⣨⣭⣤⣤⣤⣄⣀⣀⢀⣉⡀⠈⠙⠻⣿⣿⣿⣿⣿⣦⡀⠀⠀⠀⠀⠙⣌⢳⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡼⠁⠀⠀⠀⠀⠀⠀⣠⣾⣮⣿⣿⠟⠋⠀⢀⢀⣠⡴⠞⠋⠉⠁⠀⠀⠀⠀⠀⠀⠈⠉⠙⠻⢿⣷⣦⡀⠀⠙⢿⣿⣿⣿⣷⡄⠀⠀⠀⠀⠈⢦⠹⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡞⠀⠀⠀⠀⠀⠀⠀⣴⣿⣿⣿⡿⣵⠆⣠⣾⡿⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⢿⣷⣄⠀⠙⢿⣿⣿⣿⣆⠀⠀⠀⠀⠀⢧⠹⣶⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡼⠀⠀⠀⠀⠀⠀⠀⣼⣶⣿⣿⢯⡞⢁⣾⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣷⡀⠀⠻⣿⣿⣿⣧⠀⠀⠀⠀⠈⢇⢻⣽⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⠧⠀⠀⠀⠀⠀⠀⣘⢿⣿⣿⣯⠏⢠⡟⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⡄⠀⠙⣿⣿⣿⣇⠀⠀⠀⠀⠘⡄⢗⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡝⠀⠀⠀⠀⠀⢀⣿⣿⣿⢯⡟⢠⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣿⡄⠀⠸⣿⣿⣿⡄⠀⠀⠀⠀⢣⢸⠼⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣗⠇⠀⠀⠀⠀⠀⠈⣿⣿⣿⣾⠁⣾⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣷⠀⠀⠹⣿⣿⣧⠀⠀⠀⠀⠘⣤⡯⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⠀⠀⠀⠀⠀⠀⢀⣿⣿⡇⡏⢰⣿⠇⠀⢀⡀⠀⠀⠀⣀⣀⠀⠀⠀⣀⣀⣀⣀⡀⢀⡀⠀⠀⣀⡀⢀⡀⠀⢀⣀⣀⣀⡀⠘⢿⡆⠀⠈⣿⣿⣿⠀⠀⠀⠀⠀⠈⣷⣺⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⠀⠀⠀⠀⠀⠀⠸⠿⠿⢻⡇⢸⡇⠀⠀⢸⣿⠀⢀⣼⣏⣿⣦⠀⠀⣿⡯⣤⡿⠇⠈⢻⣆⣴⠟⠁⣿⡇⠀⠸⠿⠶⣦⡄⠀⢸⡇⠀⠀⢹⣿⣿⡇⠀⠀⠀⠀⣴⣷⢺⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⢘⡇⢸⣿⡆⠈⠉⠁⠈⠈⠉⠀⠀⠉⠁⠁⠉⠁⠈⠉⠀⠁⠀⠉⠉⠀⠁⠈⠁⠁⠈⠉⠉⠉⠀⠁⢸⡇⠀⠀⢸⣿⣿⡇⠀⠀⠀⠀⣿⣯⣽⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⡎⢃⠈⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⠀⠀⠀⠸⣿⣿⠃⠀⠀⠀⠀⢿⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⢠⠀⠀⢹⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡏⠀⠀⠀⢸⣛⡟⠀⠀⠀⠀⠀⡜⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⢂⠀⠀⢿⣷⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡞⠀⠀⠀⠠⣿⣿⠇⠀⠀⠀⠀⢠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠈⢆⡡⠀⠻⣿⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠞⠀⠀⠀⢠⣤⣾⡏⠀⠀⠀⠀⠀⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣧⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠋⠀⠀⠀⠠⢾⡿⠟⠁⠀⠀⠀⠀⡜⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣷⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠔⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡐⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⠿⣿⣶⣤⡄⠀⠀⠀⠀⠀⠀⠀⠀⣀⡤⠔⠊⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡜⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠻⠳⣶⡶⠒⠒⠚⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠎⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡴⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠳⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡰⠊⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠢⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠔⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣾⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣤⣶⣿⡿⠟⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⠿⠿⠛⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
" | sudo tee /etc/motd

# make a joke
echo "preparing server.. bringing the party to you../"
sleep 2
echo "I don't see how that's a PARTY!"
sleep 5

# update - upgrade - autoremove
echo -e "\e[32mupdating linux../\e[97m"
sleep 2
sudo apt update -y
sudo apt upgrade -y
sudo apt autoremove -y
echo -e "\e[93mdone\e[97m"
sleep 1

# downloading dependency libraries
echo -e "\e[32mdownloading drivers and kernals../\e[97m"
sleep 2
sudo apt-get install libhdf5-dev libc-ares-dev libatlas-base-dev libeigen3-dev -y
sudo apt-get install python3-pip python3-dev python3-venv python3-opencv git nginx postgresql -y
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g yarn
sudo apt install snapd -y
sudo systemctl enable --now snapd
sudo snap install ngrok
echo -e "\e[93mdone\e[97m"
node -v
npm -v
python3 --version
sleep 1



# clone into repo
echo -e "\e[32mcloning server../\e[97m"
sleep 2
git clone https://github.com/jayanta-banik/MLBots-server.git
echo -e "\e[93mdone\e[97m"
sleep 1

# creating the virtual environment for python
echo -e "\e[32mcreating virtual environment../\e[97m"
sleep 2
python3 -m venv ~/venv3
echo -e "\e[93mdone\e[97m"
sleep 1

echo -e "\e[32mactivating virtual environment../\e[97m"
sleep 2
echo 'source ~/venv3/bin/activate' | tee -a ~/.bashrc
source ~/venv3/bin/activate
echo -e "\e[93mdone\e[97m"
sleep 1

cd MLBots-server

# export all the variables in .env to the system
echo -e "\e[32mexporting environment variables..\e[97m"
sleep 2
export $(grep -v '^#' .env | xargs)
echo -e "\e[93mdone\e[97m"
sleep 1

echo -e "\e[32minstalling python libraries../\e[97m"
sleep 2
pip install --upgrade setuptools
pip install gunicorn fastapi "uvicorn[standard]" numpy pandas matplotlib yagmail opencv-python
# pip install tflite-runtime #depricated now
sleep 1
echo -e "\e[93mdone\e[97m"
sleep 2
deactivate

echo -e "\e[32minstalling node libraries../\e[97m"
sleep 2
yarn install
cd frontend
yarn install
cd ..
cd node_backend
yarn install
cd ..
sleep 1
echo -e "\e[93mdone\e[97m"
sleep 2

# setup pm2 to run the node server
echo -e "\e[32msetting up pm2 to run node server..\e[97m"
yarn pm2 start ecosystem.config.js
yarn pm2 startup
sudo env PATH=$PATH:/usr/bin /home/pi/MLBots-server/node_modules/pm2/bin/pm2 startup systemd -u pi --hp /home/pi
yarn pm2 save
yarn pm2 status
yarn pm2 start app.js

echo -e "\e[32mcreating services...\e[97m"
sleep 4
echo -e "\e[32m\tcreating https service\e[97m"
# <---------------- app.service ---------------->
sudo printf "
[Unit]
Description=MLBots Node Backend
After=network.target
[Service]
User=pi
Group=www-data
WorkingDirectory=/home/pi/MLBots-server/
Environment=\"PATH=/home/pi/venv3/bin\"
ExecStart=/home/pi/venv3/bin/gunicorn --workers 3 --worker-class uvicorn.workers.UvicornWorker --bind unix:app.sock -m 007 wsgi:app
[Install]
WantedBy=multi-user.target
" | sudo tee /etc/systemd/system/app.service
# <------------- end of copy to file ------------->
echo -e "\e[32m\tcreating http service\e[97m"
# <---------------- app_http.service ---------------->
sudo printf "
[Unit]
Description=Gunicorn instance to serve arduino edge devices with http only access seperate layer for minimal access
After=network.target
[Service]
User=pi
Group=www-data
WorkingDirectory=/home/pi/MLBots-server/
Environment=\"PATH=/home/pi/venv3/bin\"
ExecStart=/home/pi/venv3/bin/gunicorn --workers 2 --bind unix:app_http.sock -m 007 wsgi_http:app_http
[Install]
WantedBy=multi-user.target
" | sudo tee /etc/systemd/system/app_http.service
# <------------- end of copy to file ------------->
echo -e "\e[32m\tcreating root service\e[97m"
# <---------------- app_root.service ---------------->
sudo printf "
[Unit]
Description=Gunicorn instance to serve myproject admin only access seperate layer for minimal access
After=network.target
[Service]
User=root
Group=www-data
WorkingDirectory=/home/pi/MLBots-server/
Environment=\"PATH=/home/pi/venv3/bin\"
ExecStart=/home/pi/venv3/bin/gunicorn --workers 1 --bind unix:app_root.sock -m 007 wsgi_root:app_root
[Install]
WantedBy=multi-user.target
" | sudo tee /etc/systemd/system/app_root.service
# <------------- end of copy to file ------------->
echo -e "\e[32m\tcreating ai service\e[97m"
# <---------------- ai.service ---------------->
sudo printf "
[Unit]
Description=Gunicorn instance to serve myproject AI layer with python backend access seperate layer for minimal access
After=network.target
[Service]
User=pi
Group=www-data
WorkingDirectory=/home/pi/MLBots-server/
Environment=\"PATH=/home/pi/venv3/bin\"
ExecStart=/home/pi/venv3/bin/gunicorn --workers 1 --bind unix:ai.sock -m 007 wsgi_ai:ai
[Install]
WantedBy=multi-user.target
" | sudo tee /etc/systemd/system/ai.service
# <------------- end of copy to file ------------->

sudo systemctl start app
sudo systemctl enable app
sudo systemctl start app_http
sudo systemctl enable app_http
sudo systemctl start app_root
sudo systemctl enable app_root
sudo systemctl start ai
sudo systemctl enable ai

sleep 2
ls
sleep 4

echo -e "\e[32mcreating server node\e[97m"
sleep 2
sudo printf "
server {
    server_name pi.mlbots.in;

    location / {
        include proxy_params;
        proxy_pass http://unix:/home/pi/MLBots-server/app.sock;
        proxy_intercept_errors on;
        uwsgi_intercept_errors  on;
        error_page 404 =200 https://pi.mlbots.in/error/brokenLink;
        error_page 500 501 502 503 504 =200 https://pi.mlbots.in/error/internal;
    }
    client_max_body_size 16M;
}

server {
    root /home/pi/MLBots-server/res;
    server_name resource.mlbots.in;

    index goback.html;

    location / {
         try_files \$uri \$uri/ =404;
    }

 
}
server {
    listen 80;
    server_name arduino.mlbots.in;

    location / {
        include proxy_params;
        proxy_pass http://unix:/home/pi/MLBots-server/app_http.sock;
    }
}

server {
    if (\$host = pi.mlbots.in) {
        return 301 https://\$host\$request_uri;
    } # managed by Certbot


    listen 80;
    server_name pi.mlbots.in;
    return 404; # managed by Certbot


}

server {
    if (\$host = resource.mlbots.in) {
        return 301 https://\$host\$request_uri;
    } 


    listen 80;
    server_name resource.mlbots.in;
    return 404; # managed by Certbot
}

server {
    listen 80;
    server_name root.mlbots.in;

    location / {
        include proxy_params;
        proxy_pass http://unix:/home/pi/MLBots-server/app_root.sock;
    }
}

server {
    listen 80;
    server_name ai.mlbots.in;

    location / {
        include proxy_params;
        proxy_pass http://unix:/home/pi/MLBots-server/ai.sock;
    }
}
" | sudo tee /etc/nginx/sites-available/app


echo -e "\e[32mConfigurating nginx services...\e[97m"
sudo ln -fs /etc/nginx/sites-available/app /etc/nginx/sites-enabled
sudo rm /etc/nginx/sites-available/default
sudo rm /etc/nginx/sites-enabled/default

echo -e "\e[32mcreating backup options../\e[97m"
echo -e "\e[32mGiving excetutive rights../\e[97m"
sleep 2
sudo chmod +x backup.sh
sudo chmod +x rg.sh
echo -e "\e[93mdone\e[97m"
sleep 1

echo -e "\e[32mrestarting server../\e[97m"
./rg.sh
sudo ufw allow 'Nginx Full'
echo "completed!!"

# configure ngrok
ngrok config add-authtoken 2lZT48oc9OFv15jebVObnjpOCee_6jcXzCzLmmyCZMrivmmXs

for i in {10..0..-1}
do
echo -ne "System will restart in $i    \r"
sleep 1
done

sudo reboot